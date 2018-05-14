const http = require ("http");
const express = require("express");
const config = require ("./config");

const app = express();

//Setup server
app.set ("PORT", config.port);

//Logging all requests on the server
app.all("*", (req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

//test routing
app.get("/test/hey", (req, res, next) => {
    res.contentType("application/json");
    res.json( {"msg":"Hello to you!"});
});

//Start server
let port = process.env.PORT || app.get('PORT');

app.listen(port, () => {
    console.log("Server started on port: " + port);
});

module.exports = app;

