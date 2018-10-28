// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github');
const utils = require('./src/utils');
const GithubConnection = require('./src/GithubConnection');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the client app
app.use(cors());

// Get a code from the client to retrieve his access_token and send it
app.get('/authenticate', (req, res, next) => {
  GithubConnection.sendAccessToken(req, res, next);
});

// Create Github client if token received
app.use((req, res, next) => {
  const accessToken = req.query.access_token;

  if (typeof accessToken !== 'undefined' && accessToken != null && accessToken !== '') {
    req.client = new Github(accessToken);
    next();
  } else {
    const error = new Error('No access token received');
    error.status = 404;
    next(error);
  }
});

// Get all user's information
app.get('/user', (req, res, next) => {
  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  const response = {};
  // Get user's location
  const country = req.client.userLocation()
    .then((userLocation) => { response.country = userLocation; })
    .catch(next);

  // Get user's avatar url
  const profilePicture = req.client.userAvatarUrl()
    .then((avatar) => { response.profile_picture = avatar; })
    .catch(next);

  // Get user's milestones (account creation, first repository(public/private), first commit (public/private))
  const milestones = req.client.userCreation()
    .then(creation => req.client.userFirstRepositoryDate()
      .then(firsRepo => req.client.userFirstCommitDate()
        .then((firstCommit) => { response.milestones = [{ date: creation, label: 'account creation' }, { date: firsRepo, label: 'first repository' }, { date: firstCommit, label: 'first commit' }]; })))
    .catch(next);

  /* ========================================================================
  /*  1st graph : languages
  /*====================================================================== */

  // Get all languages of the user and contributors (private)
  const favLanguages = req.client.userLanguages()
    .then(utils.getReposLanguagesStats)
    .then((allLanguages) => { response.favLanguages = allLanguages; })
    .catch(next);

  /* ========================================================================
  /*  2nd graph : issues
  /*====================================================================== */

  // Get all user's issues from his own repos (private/public)
  const issues = req.client.userCountOpenedIssues()
    .then(opened => req.client.userCountClosedIssues()
      .then((closed) => { response.issues = [{ label: 'Opened', value: opened }, { label: 'Closed', value: closed }]; }))
    .catch(next);

  const tipTimeBetweenOpeningAndClosureIssues = req.client.userClosedIssues()
    .then((cIssues) => { response.tips = [req.client.tipsTimeBetweenOpeningAndClosureIssue(cIssues)]; })
    .catch(next);

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */

  // Get all user's trivia information (coded lines (private/public) and number of commits (private/public))
  const trivia = req.client.userCountCodedLines()
    .then(codedLines => req.client.userCountCommits()
      .then((commits) => { response.trivia = [{ label: 'Coded lines', value: codedLines }, { label: 'Commits', value: commits }]; }))
    .catch(next);

  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  // Get all user's repositories public/private information (created, forked, stars)
  const repositories = req.client.userCountCreatedRepositories()
    .then(created => req.client.userCountForkedRepositories()
      .then(forked => req.client.userCountStarsRepositories()
        .then((stars) => { response.repositories = [{ label: 'Created', value: created }, { label: 'Forked', value: forked }, { label: 'Stars', value: stars }]; })))
    .catch(next);

  /* ========================================================================
  /*  Results sending
  /*====================================================================== */
  Promise.all([country, profilePicture, milestones, favLanguages, issues, tipTimeBetweenOpeningAndClosureIssues,
    trivia, repositories,
  ])
    .then(() => {
      // Get all user's information about the tips
      response.tips.push(req.client.tipsNumberOfLanguagesToReach75PercentsOfCodedLines());
      response.tips.push(req.client.tipsNumberOfModificationsPerCommit());
      response.tips.push(req.client.tipsNumberOfCharactersPerCommit());
      response.tips.reverse();

      res.send(response);
    });
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
