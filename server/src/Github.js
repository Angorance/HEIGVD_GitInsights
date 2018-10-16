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
  constructor({token, baseUrl = 'https://api.github.com' } = {}) {
    this.token = token; // to remove
    this.baseUrl = baseUrl;
  }

  request(path, /*token,*/ opts = {}) {
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
  user(username/*, token*/) {
    return this.request(`/users/${username}`/*, token */);
  }

  // Get user's creation date
  userCreation(username) {
    return this.user(username)
      .then(user => user.created_at);
  }

  // Get user's location
  userLocation(username) {
    return this.user(username)
      .then(user => user.location);
  }

  // Get user's first pull request date
  /*userFirstPullRequestDate(username) {
    
  }*/

  // Get user's first repository creation date
 /*userFirstRepositoryDate(username) {
    
  }*/

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of a repo
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
  /* issues(username) {
        return this.request(`/users/${username}/issues`);
  } */

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /* ====================================================================== */


  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get all user's repos
  repos(username) {
    return this.request(`/users/${username}/repos`);
  }
}

module.exports = Github;
