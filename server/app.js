// loads environment variables
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');  // Used to get data from URL

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for the client app
app.use(cors());

app.get('/users/:username', (req, res, next) => {
  fetch(`https://api.github.com/users/${req.params.username}`, {
    headers:{
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${process.env.OAUTH_TOKEN}`,
    },
  })
  .then(result => result.json()
    .then((data) => {
      if(result.ok) {
        res.send(data);
      } else {
        throw new Error('Woops!');
      }
    })).catch(next);
});

app.get('/languages/:username', (req, res, next) => {
  res.send(`Hey ${req.params.username}`);
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
