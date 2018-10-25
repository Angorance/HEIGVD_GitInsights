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
  constructor({ token, baseUrl = 'https://api.github.com' } = {}) {
    this.token = token; // to remove
    this.baseUrl = baseUrl;
  }

  request(path, /* token, */entireUrl = null, opts = {}) {
    const url = entireUrl == null ? `${this.baseUrl}${path}` : entireUrl;
    const options = {
      ...opts,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${this.token}`, // to change to token
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
  user(username/* , token */) {
    return this.request(`/users/${username}`/* , token */);
  }

  /* --------------------------------------------------------------------- */

  // Get user's creation date
  userCreation(username) {
    return this.user(username)
      .then(user => user.created_at);
  }

  // Get user's first repository creation date
  userFirstRepositoryDate(username) {
    return this.repos(username)
      .then(repos => utils.getOldestCreationDate(repos));
  }

  // Get user's location
  userLocation(username) {
    return this.user(username)
      .then(user => user.location);
  }

  // Get user's avatar url
  userAvatarUrl(username) {
    return this.user(username)
      .then(user => user.avatar_url);
  }


  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of a repository
  repoLanguages(repoName) {
    return this.request(`/repos/${repoName}/languages`);
  }

  /* --------------------------------------------------------------------- */

  // Get all languages of the user
  userLanguages(username) {
    return this.repos(username)
      .then((repos) => {
        const getLanguages = repo => this.repoLanguages(repo.full_name);
        return Promise.all(repos.map(getLanguages));
      });
  }

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  // Get all user's issues
  issues(username) {
    return this.request(`/users/${username}/issues`);
  }

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /* ====================================================================== */

  // Get all commits by repository
  repoCommits(repoName) {
    return this.request(`/repos/${repoName}/commits`);
  }

  // Get all personal commits of user's repositories
  reposPersonalCommits(username) {
    return this.repos(username)
      .then((repos) => {
        // Get commits for each repo
        const getCommits = repo => this.repoCommits(repo.full_name)
          .then(commits => (commits).filter(commit => commit.author != null && commit.author.login === username));

        // Get all commits of the user
        return Promise.all(repos.map(getCommits))
          .then(results => results.reduce((acc, elem) => acc.concat(elem), []));
      });
  }

  /* --------------------------------------------------------------------- */

  // Get user's number of coded lines
  userCountCodedLines(username) {
    // Get all url of user's personal commits
    return this.reposPersonalCommits(username)
      .then((personalCommits) => {
        // Get all urls of user's personal commits
        const url = personalCommit => personalCommit.url;
        return personalCommits.map(url);
      })
      .then((urls) => {
        // Get all lines added in personal commits
        const codedLines = url => this.request(null, url)
          .then(personalCommit => personalCommit.stats.additions);

        return Promise.all(urls.map(codedLines))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      });
  }

  // Get user's number of commits
  userCountCommits(username) {
    return this.reposPersonalCommits(username)
      .then(results => results.length);
  }

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get all user's repositories
  repos(username) {
    return this.request(`/users/${username}/repos`);
  }

  // Get all user's created repositories
  userCountCreatedRepositories(username) {
    return this.repos(username)
      .then(repos => repos.length);
  }

  // Get all user's forked repositories
  // let nbrForkedRepositories = 0;

  userCountForkedRepositories(username) {
    return this.repos(username)
      .then((repos) => {
        const nbrForkedRepositories = repo => (repo.fork === true ? 1 : 0);
        return Promise.all(repos.map(nbrForkedRepositories))
          .then(results => results.reduce((elem, acc) => elem + acc, 0));
      });
  }

  // Get all user's stars

  // Get all user's commits
  // GET /repos/:owner/:repo/commits
}

module.exports = Github;
