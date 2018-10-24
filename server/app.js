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
const client = new Github({ token: process.env.OAUTH_TOKEN });

// Enable CORS for the client app
app.use(cors());

// Get all user's information
/*app.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});*/

// Get a code from the client to retrieve his access_token and send it
app.get('/authenticate', (req, res, next) => {
  // Get the access_token of the client and send it
  GithubConnection.sendAccessToken(req, res, next);
});

// Get all user's information
app.get('/users/:username'/*?:token'*/, (req, res, next) => {
  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  const response = {};

  // Get user's creation date
  const creationDate = client.userCreation(req.params.username)
    .then(creation => response.creationDate = creation)
    .catch(next);

  // Get user's first repository creation date
  const firstRepositoryDate = client.userFirstRepositoryDate(req.params.username)
    .then(firstRepository => response.firstRepositoryDate = firstRepository)
    .catch(next);
  
  // Get user's location
  const location = client.userLocation(req.params.username)
    .then(location => response.location = location)
    .catch(next);

  // Get user's avatar url
  const avatarUrl = client.userAvatarUrl(req.params.username)
    .then(avatar => response.avatarUrl = avatar)
    .catch(next);

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get user's number of coded lines by language
  const languages = client.userLanguages(req.params.username)
    .then(utils.getReposLanguagesStats)
    .then(languages => response.languages = languages)
    .catch(next);

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  // Get all user's issues
  /*const issues = client.issues(req.params.username)
    .then(issues => response.issues = issues)
    .catch(next);*/

  // Get all user's opened issues

  // Get all user's closed issues

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  // Get all user's line coded
  const nbrCodedLines = client.userCountCodedLines(req.params.username)
    .then(total => response.nbrCodedLines = total)
    .catch(next);

  // Get all user's commits
  const nbrCommits = client.userCountCommits(req.params.username)
    .then(total => response.nbrCommits = total)
    .catch(next);

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get user's repositories
  /*const repos = client.repos(req.params.username)
    .then(repos => response.repos = repos)
    .catch(next);*/

  // Get all user's created repositories
  const nbrCreatedRepositories = client.userCountCreatedRepositories(req.params.username)
    .then(total => response.nbrCreatedRepositories = total)
    .catch(next);

  // Get all user's forked repositories
  const nbrForkedRepositories = client.userCountForkedRepositories(req.params.username)
    .then(total => response.nbrForkedRepositories = total)
    .catch(next);

  // Get all user's stars

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
