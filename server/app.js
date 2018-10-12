// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const Github = require('./src/Github'); // FOr using our Github.js file
const utils = require('./src/utils'); // For packing languages (group by)

const app = express();
const port = process.env.PORT || 3000;
const client = new Github({ token: process.env.OAUTH_TOKEN }); // Used to create my own Github connection (@LNAline)

// Enable CORS for the client app
app.use(cors());

// Get all user's information
/* app.get('/users/:username', (req, res, next) => {
    client.user(req.params.username)
      .then(user => res.send(user))
      .catch(next);
  }); */

// Get all user's information
app.get('/users/:username', (req, res, next) => {
  /* ========================================================================
  /*  Timeline
  /*====================================================================== */

  const response = {};

  // Get user's location
  const location = client.userLocation(req.params.username)
    .then(location => response.location = location)
    .catch(next);

  // Get user's creation
  const creation = client.userCreation(req.params.username)
    .then(creation => response.creation = creation)
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
  /* app.get('/issues/:username', (req, res, next) => {
    client.issues(req.params.username)
      .then(issues => res.send(issues))
      .catch(next);
  }); */

  /* ========================================================================
  /*  3nd graph : coded lines and commits
  /*====================================================================== */


  /* ========================================================================
  /*  4nd graph : repositories
  /*====================================================================== */

  Promise.all([location, creation, languages])
    .then(() => res.send(response));
});

// Callback handler
app.get('/callback', (req, res, next) => {
    /*client.issues(req.params.username)
      .then(issues => res.send(issues))
      .catch(next);*/
      res.send('Not integrated right now');
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
