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

// /users/username => get all user's information
app.get('/users/:username', (req, res, next) => {
  client.user(req.params.username)
    .then(user => res.send(user))
    .catch(next);
});

// /languages/username => get number of lines coded of each language of the user
app.get('/languages/:username', (req, res, next) => {
  client.userLanguages(req.params.username)
    .then(utils.getReposLanguagesStats)
    .then(stats => res.send(stats))
    .catch(next);
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
