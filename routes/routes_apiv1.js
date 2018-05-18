const express = require("express");
const apiRouter = express.Router();
const sHuisRouter = require ("./routes_apiv1_sHuis");
const maaltijdRouter = require ("./routes_apiv1_maaltijd");
const deelnemerRouter = require ("./routes_apiv1_deelnemer");
const auth = require("../auth/authentication");
const userManager = require ("../managers/user_manager");



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

//Login & register.
apiRouter.post("/login", userManager.loginUser);
apiRouter.post("/register", userManager.createUser);

//Followup routes.
apiRouter.use("/studentenhuis", sHuisRouter);
apiRouter.use('/studentenhuis/:huisId/maaltijd', function(req, res, next) {
    //Pass huisID to maaltijdRouter
    req.huisId = req.params.huisId;
    next();
}, maaltijdRouter);
apiRouter.use("/studentenhuis/:huisId/maaltijd/:maaltijdId/deelnemers", function (req, res, next) {
    //Pass huisID and maaltijdID to deelnemerRouter
    req.huisId = req.params.huisId;
    req.maaltijdId = req.params.maaltijdId;
    next();
}, deelnemerRouter);

module.exports = apiRouter;