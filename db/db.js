
const express = require('express');
var mysql = require('mysql');
var config = require('../db/config');

var connectionSettings = {
    host: process.env.DB_HOST || config.dbHost,
    user: process.env.DB_USER || config.dbUser,
    password: process.env.DB_PASSWORD || config.dbPassword,
    database: config.dbDatabase,
    port: 3000,
    debug: false
}

var connection = mysql.createConnection(connectionSettings);

connection.connect(function(error) {
    if (error){
        console.log(error);
        return;
    } else{
        console.log("Connected")
    }
});

module.exports = connection;

