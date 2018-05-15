const http = require ("http");
const express = require("express");
const config = require ("./config.json");
const bodyParser = require("body-parser");
const ApiError = require ("./domain/ApiError");

const app = express();

//Setup server
app.set("PORT", config.port || process.evn.PORT );
app.set("SECRET_KEY", config.secretKey);
app.set("TOKEN_EXPIRY", config.tokenExpiry);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//Logging all requests on the server
app.all("*", (req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

app.get("/port", function (req, res) {
    console.log(process.env.TOKEN_EXPIRY);
    res.status(200).json({"port": process.env.TOKEN_EXPIRY});
});

//API routes
app.use("/api", require("./routes/routes_apiv1"));

//Error handling
app.use((err, req, res, next) => {
    console.log("Api error occured.");
    console.log(err.toString());

    const error = new ApiError(err.toString(), 404);

    res.status(404).json(error).end();
});

//Start server
const port = process.env.PORT || app.get('PORT');

app.listen(port, () => {
    console.log("Server started on port: " + port);
});

module.exports = app;

