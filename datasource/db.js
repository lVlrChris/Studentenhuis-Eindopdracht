const express = require('express');
const mysql = require('mysql');
const config = require('../config');

var connectionSettings = {
    host: process.env.DB_HOST || config.dbHost,
    user: process.env.DB_USER || config.dbUser,
    password: process.env.DB_PASSWORD || config.dbPassword,
    database: config.dbDatabase,
    port: process.env.DB_PORT || config.dbPort,
    debug: false
}

var connection = mysql.createConnection(connectionSettings);

connection.connect(function(error) {
    if (error){
        console.log(error);
        return;
    } else{
        console.log("Database connected.")
    }
});

module.exports = connection;
