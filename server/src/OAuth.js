const request = require('request');

// Must be stored somewhere else, temporary
const client_id = '2a9a479e2953860bbd89';
const client_secret = '7100d1e611dd28e989fd81009f4e78a09e96ecaa';

function oauthCallback(req, res, next) {
    let code = req.query.code;

    console.log(`Code received : ${code}`);

    let reqToken = {
        uri: 'https://github.com/login/oauth/access_token',
        body: JSON.stringify(findAName(code)),
        method: 'POST',
    }

    request(reqToken, function (error, response) {
        console.log(`Access Token received : ${response.query.access_token}`);
    });
}

function findAName(code) {
    return {
        "client_id": client_id,
        "client_secret": client_secret,
        "code": code
    };
}

module.exports = {
    oauthCallback,
};
