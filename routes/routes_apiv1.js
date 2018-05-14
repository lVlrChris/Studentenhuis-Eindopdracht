const express = require("express");
const router = express.Router();
const auth = require("../auth/authentication");
const users = require("../datasource/temp_users");


//Catch all except login
router.all(new RegExp("[^(\/login)]"), (req, res, next) => {
    console.log("Checking token..");

    //Retrieve token from header
    const token = (req.header("X-Access-Token")) || "";

    //Check token
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log("Error: " + err.message);
            res.status((err.status || 401)).json({error: new Error("Not autorised").message});
        } else {
            next();
        }
    });

});

//Login
router.post("/login", (req, res) => {

    //Get username and password
    const email = req.body.email || "";
    const password = req.body.password || "";

    //Check existing user
    result = users.filter((user) => {
        if (user.email === email && user.password === password) {
            return( user );
        }
    });

    console.log("Result user: " + JSON.stringify(result[0]));

    //Make token if user exists
    if (result[0]) {
        res.status(200).json({"token" : auth.encodeToken(result.id), "email" : email});
    } else {
        res.status(401).json({"error" : "Invalid credentials."});
    }
});



//Catch empty get
// router.get("*", (req, res) => {
//     res.status(200);
//     res.json({"description": "This is API version 1"});
// });

module.exports = router;