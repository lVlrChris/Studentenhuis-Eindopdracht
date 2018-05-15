const express = require("express");
const apiRouter = express.Router();
const sHuisRouter = require ("./routes_apiv1_sHuis");
const maaltijdRouter = require ("./routes_apiv1_maaltijd");
const auth = require("../auth/authentication");
const users = require("../datasource/temp_users");
let Student = require("../domain/Student");
let ApiError = require("../domain/ApiError");


//Catch all except login
apiRouter.all(new RegExp("[^(\/login)|(\/register)]"), (req, res, next) => {
    console.log("Checking token..");

    //Retrieve token from header
    const token = (req.header("X-Access-Token")) || "";

    //Check token
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log("Error: " + err.message);
            res.status((err.status || 401)).json({error: new Error("Not autorised").message});
        } else {
            console.log("Correct token.");
            next();
        }
    });

});

//Login
apiRouter.post("/login", (req, res) => {

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
        res.status(412).json(new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412));
    }
});

apiRouter.post("/register", (req, res) => {

    //Get new user info
    const firstName = req.body.firstname || "";
    const lastName  = req.body.lastname || "";
    const email = req.body.email || "";
    const password = req.body.password || "";

    newStudent = new Student(firstName, lastName, email, password);

    if(newStudent.getValidation()) {
        res.status(200).json({"token": auth.encodeToken(newStudent.id), "email": newStudent.email});
    } else {
        res.status(412).json(new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412));
    }

    //TODO: add new student to DB
    //TODO: set ID after entry.

});

//Followup routes
apiRouter.use("/studentenhuis", sHuisRouter);

apiRouter.use('/studentenhuis/:huisId/maaltijd', function(req, res, next) {
    req.huisId = req.params.huisId;
    next()
}, maaltijdRouter);

//TODO: Deelnemer router


//Catch all others
apiRouter.all("*", (req, res) => {
    res.status(200);
    res.json({"description": "This is API version 1"});
});

module.exports = apiRouter;