// const request = require('request');
const fetch = require('node-fetch'); // Used to get data from URL

// Must be stored somewhere else, temporary
const clientId = '2a9a479e2953860bbd89';
const clientSecret = '7100d1e611dd28e989fd81009f4e78a09e96ecaa';

function oauthCallback(req, res, next) {
  const codeReceived = req.query.code;

  console.log(`Code received : ${codeReceived}`);

  const url = 'https://github.com/login/oauth/access_token';
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: codeReceived
  };

  const options = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  };

  fetch(url, options)
    .then(data => data.json())
    .then(res => console.log(`Access-token received : ${res.access_token}`))
    .catch(error => console.log(error));
}

module.exports = { oauthCallback };
