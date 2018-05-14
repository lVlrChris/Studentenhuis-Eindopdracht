const config = require("../config");
const jwt = require("jwt-simple");
const moment = require("moment");

//User ID to JWT Token
function encodeToken(userID) {
    const payload = {
        exp: moment().add(6, "hour").unix(),
        iat: moment().unix(),
        sub: userID
    };

    return jwt.encode(payload, config.secretkey);
}

//JWT Token to user ID
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, config.secretkey);

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