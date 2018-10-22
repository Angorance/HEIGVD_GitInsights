const request = require('request');

// Must be stored somewhere else, temporary
const clientId = '2a9a479e2953860bbd89';
const clientSecret = '7100d1e611dd28e989fd81009f4e78a09e96ecaa';

function findAName(code) {
  return {
    clientId,
    clientSecret,
    code,
  };
}

function oauthCallback(req, res, next) {
  const code = req.query.code;

  console.log(`Code received : ${code}`);

  const reqToken = {
    uri: 'https://github.com/login/oauth/access_token',
    body: JSON.stringify(findAName(code)),
    method: 'POST',
  };

  request(reqToken, (error, response) => {
    console.log(`Access Token received : ${response.query.access_token}`);
  });
}

module.exports = {
  oauthCallback,
};
