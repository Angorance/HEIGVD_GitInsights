// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github'); // For using our Github.js file
const utils = require('./src/utils'); // For packing languages (group by)
const GithubConnection = require('./src/GithubConnection'); // For connection the user to Github

const app = express();
const port = process.env.PORT || 3000;

// Used to create my own Github connection (@LNAline)
const client = new Github();

// Enable CORS for the client app
app.use(cors());

// Get a code from the client to retrieve his access_token and send it
app.get('/authenticate', (req, res, next) => {
  // Get the access_token of the client and send it
  GithubConnection.sendAccessToken(req, res, next);
});

// Get all user's information
app.get('/user', (req, res, next) => {
  const accessToken = req.query.access_token;
  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  const response = {};

  // Get user's creation date
  const creationDate = client.userCreation(accessToken)
    .then((creation) => { response.creationDate = creation; })
    .catch(next);

  // Get user's first repository creation date (private/public)
  const firstRepositoryDate = client.userFirstRepositoryDate(accessToken)
    .then((firstRepository) => { response.firstRepositoryDate = firstRepository; })
    .catch(next);

  // Get user's location
  const location = client.userLocation(accessToken)
    .then((userLocation) => { response.location = userLocation; })
    .catch(next);

  // Get user's avatar url
  const avatarUrl = client.userAvatarUrl(accessToken)
    .then((avatar) => { response.avatarUrl = avatar; })
    .catch(next);

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of the user and contributors (private)
  const languages = client.userLanguages(accessToken)
    .then(utils.getReposLanguagesStats)
    .then((allLanguages) => { response.languages = allLanguages; })
    .catch(next);

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  // Get all user's issues
  /* const issues = client.issues(req.params.username)
    .then(issues => response.issues = issues)
    .catch(next); */

  // Get all user's opened issues

  // Get all user's closed issues

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  // Get all user's line coded (public)
  const nbrCodedLines = client.userCountCodedLines(accessToken)
    .then((total) => { response.nbrCodedLines = total; })
    .catch(next);

  // Get all user's commits (private/public)
  const nbrCommits = client.userCountCommits(accessToken)
    .then((total) => { response.nbrCommits = total; })
    .catch(next);

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get user's repositories
  /* const repos = client.repos(req.params.username)
    .then(repos => response.repos = repos)
    .catch(next); */

  // Get user's number of created repositories (private/public)
  const nbrCreatedRepositories = client.userCountCreatedRepositories(accessToken)
    .then((total) => { response.nbrCreatedRepositories = total; })
    .catch(next);

  // Get all user's forked repositories (private/public)
  const nbrForkedRepositories = client.userCountForkedRepositories(accessToken)
    .then((total) => { response.nbrForkedRepositories = total; })
    .catch(next);

  // Get all user's stars (private/public)

  /* ========================================================================
  /*  Results sending
  /*====================================================================== */
  Promise.all([creationDate, firstRepositoryDate, location, avatarUrl,
    languages,
    nbrCodedLines, nbrCommits,
    nbrCreatedRepositories, nbrForkedRepositories,
    /* issues */
  ])
    .then(() => res.send(response));
});

// Forward 404 to error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
