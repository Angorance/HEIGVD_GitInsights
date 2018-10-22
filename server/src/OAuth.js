const fetch = require('node-fetch'); // Used to post data from URL

// Must be stored somewhere else, temporary
const clientId = '2a9a479e2953860bbd89';
const clientSecret = '7100d1e611dd28e989fd81009f4e78a09e96ecaa';

/**
 * Return a cookie with access_token to the client
 * @param {*} req callback request sent by Github
 * @param {*} res cookie to send to the client
 * @param {*} next next function
 */
function oauthCallback(req, res, next) {
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
      res.cookie('Github connection', accessToken, {
        domain: '.angorance.github.io',
        path: '/GitInsights',
        httpOnly: true,
        secure: true,
        maxAge: 600000,
      });

      // Redirect
      res.redirect('https://angorance.github.io/GitInsights');
    })
    .catch(next);
}

module.exports = { oauthCallback };
