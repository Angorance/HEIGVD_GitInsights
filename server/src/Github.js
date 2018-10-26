const fetch = require('node-fetch');
const utils = require('./utils');

class ResponseError extends Error {
  constructor(res, body) {
    super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
    this.status = res.status;
    this.path = res.url;
    this.body = body;
  }
}

class Github {
  constructor({ baseUrl = 'https://api.github.com' } = {}) {
    this.baseUrl = baseUrl;
  }

  request(path, token, entireUrl = false, opts = {}) {
    const url = entireUrl ? `${path}` : `${this.baseUrl}${path}`;
    const options = {
      ...opts,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
      },
    };

    return fetch(url, options)
      .then(res => res.json()
        .then((data) => {
          if (!res.ok) {
            throw new ResponseError(res, data);
          }

          return data;
        }));
  }

  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  // Get all user's information
  user(token) {
    return this.request('/user', token);
  }

  // Get user's login
  getLogin(token) {
    return this.user(token)
      .then(profile => profile.login);
  }

  /* --------------------------------------------------------------------- */

  // Get user's location
  userLocation(token) {
    return this.user(token)
      .then(user => user.location);
  }

  // Get user's avatar url
  userAvatarUrl(token) {
    return this.user(token)
      .then(user => user.avatar_url);
  }

  // Get user's creation date
  userCreation(token) {
    return this.user(token)
      .then(user => user.created_at);
  }

  // Get user's first repository creation date (private/public)
  userFirstRepositoryDate(token) {
    return this.publicRepos(token)
      .then(publicRepos => utils.getOldestRepository(publicRepos))
      .then(oldestPublic => this.privateRepos(token)
        .then(privateRepos => utils.getOldestRepository(privateRepos))
        .then((oldestPrivate) => {
          const array = [{ created_at: oldestPublic }, { created_at: oldestPrivate }];
          return utils.getOldestRepository(array);
        }));
  }

  userFirstCommitDate(token) {
    return this.reposPublicPersonalCommits(token)
      .then(publicRepos => utils.getOldestCommit(publicRepos))
      .then(oldestPublic => this.reposPrivatePersonalCommits(token)
        .then(privateRepos => utils.getOldestCommit(privateRepos))
        .then((oldestPrivate) => {
          const array = [
            { commit: { author: { date: oldestPublic } } }, { commit: { author: { date: oldestPrivate } } }];
          return utils.getOldestCommit(array);
        }));
  }

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of a repository
  repoLanguages(repoName, token) {
    return this.request(`/repos/${repoName}/languages`, token);
  }

  /* --------------------------------------------------------------------- */

  // Get all languages of the user and contributors (private)
  userLanguages(token) {
    return this.privateRepos(token)
      .then((repos) => {
        const getLanguages = repo => this.repoLanguages(repo.full_name, token);
        return Promise.all(repos.map(getLanguages));
      });
  }

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  // Get all user's issues from his own repos
  issues(token) {
    return this.request('/user/issues', token);
  }

  /* --------------------------------------------------------------------- */

  // Get all user's opened issues
  userOpenedIssues(token) {
    return this.issues(token)
      .then((issues) => {
        const openedIssues = issue => (issue.state === 'open' ? 1 : 0);
        return Promise.all(issues.map(openedIssues))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      });
  }

  // Get all user's closed issues
  userClosedIssues(token) {
    return this.issues(token)
      .then((issues) => {
        const closedIssues = issue => (issue.state === 'close' ? 1 : 0);
        return Promise.all(issues.map(closedIssues))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      });
  }

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /* ====================================================================== */

  // Get all commits by repository
  repoCommits(repoName, token) {
    return this.request(`/repos/${repoName}/commits`, token);
  }

  // Get all public personal commits of user's repositories
  reposPublicPersonalCommits(token) {
    return this.publicRepos(token)
      .then(repos => this.getLogin(token)
        .then((username) => {
          // Get all personal commits
          const getCommits = repo => this.repoCommits(repo.full_name, token)
            .then(commits => (commits).filter(commit => commit.author != null
              && commit.author.login === username));

          // Get all commits of the user
          return Promise.all(repos.map(getCommits))
            .then(results => results.reduce((acc, elem) => acc.concat(elem), []));
        }));
  }

  // Get all private personal commits of user's repositories
  reposPrivatePersonalCommits(token) {
    return this.privateRepos(token)
      .then(repos => this.getLogin(token)
        .then((username) => {
          // Get all personal commits
          const getCommits = repo => this.repoCommits(repo.full_name, token)
            .then(commits => (commits).filter(commit => commit.author != null
              && commit.author.login === username));

          // Get all commits of the user
          return Promise.all(repos.map(getCommits))
            .then(results => results.reduce((acc, elem) => acc.concat(elem), []));
        }));
  }

  // Get number of public coded lines
  userCountPublicCodedLines(token) {
    return this.reposPublicPersonalCommits(token)
      .then((publicCommits) => {
        // Get all urls of user's public personal commits
        const publicUrl = publicCommit => publicCommit.url;
        return publicCommits.map(publicUrl);
      })
      .then((publicUrls) => {
        // Get all lines added in public personal commits
        const publicLines = publicUrl => this.request(publicUrl, token, true)
          .then(publicCommit => publicCommit.stats.additions);

        return Promise.all(publicUrls.map(publicLines))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      });
  }

  /* --------------------------------------------------------------------- */

  // Get user's number of coded lines (public)
  userCountCodedLines(token) {
    // Get all url of user's personal commits
    return this.reposPublicPersonalCommits(token)
      .then(commits => (commits.length <= 1000 ? this.userCountPublicCodedLines(token) : '999+'));
  }

  // Get user's number of commits (public)
  userCountCommits(token) {
    return this.reposPublicPersonalCommits(token)
      .then(publicCommits => publicCommits.length);
  }

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get all user's public repositories
  publicRepos(token) {
    return this.getLogin(token)
      .then(username => this.request(`/users/${username}/repos`, token));
  }

  // Get all user's private repositories
  privateRepos(token) {
    return this.request('/user/repos', token);
  }

  // Get all user's public personal repositories
  publicPersonalRepos(token) {
    return this.publicRepos(token)
      .then(publicRepos => this.getLogin(token)
        .then(username => publicRepos.filter(repo => repo.owner.login === username)));
  }

  // Get all user's private personal repositories
  privatePersonalRepos(token) {
    return this.privateRepos(token)
      .then(privateRepos => this.getLogin(token)
        .then(username => privateRepos.filter(repo => repo.owner.login === username)));
  }

  /* personalRepos(token, typeRepos) {
    return typeRepos(token)
      .then(repos => this.getLogin(token)
        .then(username => repos.filter(repo => repo.owner.login === username)));
  } */

  /* personalRepos(token, typeRepos) {
    return typeRepos(token)
      .then(function repos(repos) {
        return this.getLogin(token)
          .then(username => repos.filter(repo => repo.owner.login === username));
      });
  } */

  /* --------------------------------------------------------------------- */

  // Get user's number of created repositories (private/public)
  /* userCountCreatedRepositories(token) {
    return this.personalRepos(token, this.publicRepos)
      .then(publicRepos => this.personalRepos(token, this.privateRepos)
        .then(privateRepos => publicRepos.length + privateRepos.length));
  } */

  userCountCreatedRepositories(token) {
    return this.publicPersonalRepos(token)
      .then(publicRepos => this.privatePersonalRepos(token)
        .then(privateRepos => publicRepos.length + privateRepos.length));
  }

  // Get all user's forked repositories (private/public)
  userCountForkedRepositories(token) {
    return this.publicRepos(token)
      .then((publicRepos) => {
        const nbrForkedRepositories = publicRepo => (publicRepo.fork === true ? 1 : 0);
        return Promise.all(publicRepos.map(nbrForkedRepositories))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      })
      .then(nbrPublicForkedRepos => this.privateRepos(token)
        .then((privateRepos) => {
          const nbrForkedRepositories = privateRepo => (privateRepo.fork === true ? 1 : 0);
          return Promise.all(privateRepos.map(nbrForkedRepositories))
            .then(results => results.reduce((elem, acc) => elem + acc, 0));
        })
        .then(nbrPrivateForkedRepos => nbrPrivateForkedRepos + nbrPublicForkedRepos));
  }

  // Get all user's stars (private/public)
  userCountStarsRepositories(token) {
    return this.publicRepos(token)
      .then((publicRepos) => {
        const stars = publicRepo => publicRepo.stargazers_count;
        return Promise.all(publicRepos.map(stars))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      })
      .then(nbrPublicStars => this.privateRepos(token)
        .then((privateRepos) => {
          const stars = privateRepo => privateRepo.stargazers_count;
          return Promise.all(privateRepos.map(stars))
            .then(results => results.reduce((elem, acc) => elem + acc, 0));
        })
        .then(nbrPrivateStars => nbrPrivateStars + nbrPublicStars));
  }
}

module.exports = Github;
