const fetch = require('node-fetch'); // Used to post data from URL

// Must be stored somewhere else, temporary
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

/**
 * Return the access_token of the client
 * @param {*} req get request sent by the client with the code inside
 * @param {*} res access_token received from Github
 * @param {*} next next function
 */
function getAccessToken(req, res, next) {
  // Get code from Github
  const codeReceived = req.query.code;
  console.log(`Code received : ${codeReceived}`);

  // Create the POST request
  const url = 'https://github.com/login/oauth/access_token';

  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: codeReceived,
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  // Send the POST request to Github, to receive the access_token
  fetch(url, options)
    .then(data => data.json())
    .then((result) => {
      // Get the access_token
      const accessToken = result.access_token;
      console.log(`Access-token received : ${accessToken}`);

      // Create the cookie
      /*res.cookie('Github_connection', accessToken, {
        domain: '.angorance.github.io',
        path: '/GitInsights',
        httpOnly: true,
        secure: true,
        maxAge: 600000,
      });*/

      // Redirect
      res.send(accessToken/*'https://angorance.github.io/GitInsights'*/);
    })
    .catch(next);
}

module.exports = { getAccessToken };
