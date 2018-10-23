const fetch = require('node-fetch'); // Used to get data from URL

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

  request(path, /*token, */ opts = {}) {
    const url = `${this.baseUrl}${path}`;
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
  user(username/*, token */) {
    return this.request(`/users/${username}`/* , token */);
  }

  // Get user's creation date
  userCreation(username) {
    return this.user(username)
      .then(user => user.created_at);
  }

  // Get user's first repository creation date
  userFirstRepositoryDate(username) {
    return this.repos(username)
      .then((repos) => {
        repos.sort((a, b) => new Date(b.date) - new Date(a.date));
        return repos[0].created_at;
      });
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
