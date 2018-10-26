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
  // Get user's location
  const country = client.userLocation(accessToken)
    .then((userLocation) => { response.country = userLocation; })
    .catch(next);

  // Get user's avatar url
  const profilePicture = client.userAvatarUrl(accessToken)
    .then((avatar) => { response.profile_picture = avatar; })
    .catch(next);

  // Get user's milestones (account creation, first repository(public/private))
  const milestones = client.userCreation(accessToken)
    .then(creation => client.userFirstRepositoryDate(accessToken)
      .then((firsRepo) => { response.milestones = [{ date: creation, label: 'account creation' }, { date: firsRepo, label: 'first repository' }]; }))
    .catch(next);

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of the user and contributors (private)
  const favLanguages = client.userLanguages(accessToken)
    .then(utils.getReposLanguagesStats)
    .then((allLanguages) => { response.favLanguages = allLanguages; })
    .catch(next);

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  /* const issues = client.issues(req.params.username)
      .then(issues => response.issues = issues)
      .catch(next); */

  // Get all user's issues
  const issues = [];/* client.userOpenedIssues(accessToken)
    .then(opened => client.userClosedIssues(accessToken)
      .then((closed) => { response.issues = [{ label: 'Opened', value: opened }, { label: 'Closed', value: closed }]; }))
    .catch(next); */

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  // Get all user's trivia information (public coded lines and public number of commits)
  const trivia = client.userCountCodedLines(accessToken)
    .then(codedLines => client.userCountCommits(accessToken)
      .then((commits) => { response.trivia = [{ label: 'Lines coded', value: codedLines }, { label: 'Commits', value: commits }]; }))
    .catch(next);

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get user's repositories
  /* const repos = client.repos(req.params.username)
    .then(repos => response.repos = repos)
    .catch(next); */

  // Get all user's repositories public/private information (created, forked, stars)
  const repositories = client.userCountCreatedRepositories(accessToken)
    .then(created => client.userCountForkedRepositories(accessToken)
      .then(forked => client.userCountStarsRepositories(accessToken)
        .then((stars) => { response.repositories = [{ label: 'Created', value: created }, { label: 'Forked', value: forked }, { label: 'Stars', value: stars }]; })))
    .catch(next);

  // Get all user's stars (private/public)

  /* ========================================================================
  /*  Results sending
  /*====================================================================== */
  Promise.all([country, profilePicture, milestones, favLanguages, issues,
    trivia, repositories,
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
