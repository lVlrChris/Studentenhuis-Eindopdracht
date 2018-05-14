const http = require ("http");
const express = require("express");
const config = require ("./config.json");
const bodyParser = require("body-parser");

const app = express();

//Setup server
app.set("PORT", config.port);
app.set("SECRET_KEY", config.secretkey);

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//Logging all requests on the server
app.all("*", (req, res, next) => {
    console.log(req.method + " " + req.url);
    next();
});

app.use(express.static(__dirname + '/public'));

//Test routing
app.get("/test/hey", (req, res) => {
    res.contentType("application/json");
    res.json({"msg":"Hello to you!"});
});

//API routes
app.use("/api", require("./routes/routes_apiv1"));

//Start server
let port = process.env.PORT || app.get('PORT');

app.listen(port, () => {
    console.log("Server started on port: " + port);
});

module.exports = app;

