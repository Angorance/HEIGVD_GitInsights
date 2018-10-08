// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github'); // FOr using our Github.js file
const utils = require('./src/utils'); // For packing languages (group by)

const app = express();
const port = process.env.PORT || 3000;
const client = new Github({token: process.env.OAUTH_TOKEN}); // Used to create my own Github connection (@LNAline)

// Enable CORS for the client app
app.use(cors());

/*========================================================================
/*  Timeline
/*======================================================================*/

// Get all user's information
app.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});

// Get user's location
app.get('/location/:username', (req, res, next) => {
  client.userLocation(req.params.username)
    .then(location => res.send(location))
    .catch(next);
});

// Get user's creation
app.get('/creation/:username', (req, res, next) => {
  client.userCreation(req.params.username)
    .then(creation => res.send(creation))
    .catch(next);
});

/*========================================================================
/*  1st graph : languages
/*======================================================================*/

// Get user's number of coded lines by language
app.get('/languages/:username', (req, res, next) => {
  client.userLanguages(req.params.username)
    .then(utils.getReposLanguagesStats)
    .then(stats => res.send(stats))
    .catch(next);
});

/*========================================================================
/*  2nd graph : issues
/*======================================================================*/

// Get all user's issues
app.get('/issues/:username', (req, res, next) => {
  client.issues(req.params.username)
    .then(issues => res.send(issues))
    .catch(next);
});

/*========================================================================
/*  3nd graph : coded lines and commits
/*======================================================================*/


/*========================================================================
/*  4nd graph : repositories
/*======================================================================*/


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
