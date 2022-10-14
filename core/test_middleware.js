const validator = require("validator");

module.exports = function (req, res, next) {

    const blacklist = validator.blacklist("input\kjfjh[");
    const vEscape = validator.escape("<h1>Hello, <strong>there!</strong></h1>")
    console.log(blacklist);
    next();
}