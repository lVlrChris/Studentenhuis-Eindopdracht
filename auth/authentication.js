const config = require("../config");
const jwt = require("jwt-simple");
const moment = require("moment");

//User ID to JWT Token
function encodeToken(userID) {
    const payload = {
        exp: moment().add(config.tokenExpiry, "hour").unix(),
        iat: moment().unix(),
        sub: userID
    };

    return jwt.encode(payload, config.secretKey);
}

//JWT Token to user ID
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, config.secretKey);

        //Check token expiry
        const now = moment().unix();

        if (now > payload.exp) {
            console.log("Token has expired");
        }

        //Callback with userID
        cb(null, payload);

    } catch (err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};