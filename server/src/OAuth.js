function oauthCallback(req, res, next) {
    let code = req.query.code;

    console.log(`Code received : ${code}`);
}

module.exports = {
    oauthCallback,
};
