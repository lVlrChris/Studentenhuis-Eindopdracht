const http = require ("http");
const express = require("express");
const config = require ("./config.json");
const bodyParser = require("body-parser");
const ApiError = require ("./domain/ApiError");

const app = express();

//Setup server
app.set("PORT", config.port || process.evn.PORT );
app.set("SECRET_KEY", config.secretKey || process.env.SECRET_KEY);
app.set("TOKEN_EXPIRY", config.tokenExpiry || process.env.TOKEN_EXPIRY);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//Logging all requests on the server
app.all("*", (req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

//API routes
app.use("/api", require("./routes/routes_apiv1"));

//Catch all others
app.all("*", (req, res) => {
    res.status(404);
    res.json({"description": "Not an endpoint."});
});

//Error handling
app.use((err, req, res, next) => {
    console.log("Api error occured.");
    console.log(err.toString());

    const error = new ApiError(err.toString(), err.status);

    res.status(error.code).json(error).end();
});

//Start server
const port = process.env.PORT || app.get('PORT');

app.listen(port, () => {
    console.log("Server started on port: " + port);
});

module.exports = app;

