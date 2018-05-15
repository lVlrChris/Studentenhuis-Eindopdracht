

const express = require('express');
const mysql = require('mysql');

const app = express();

//create connection
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'user',
  database : 'nodemysql'
});

//connect

db.connect((err) => {
    if(err){
        console.log(err);
        throw err;
    }
    console.log('mysql connected');
})

app.listen('3000', () => {
    // console.log('Server started on port 3000' + `Connected to ${db.database}`);
    console.log('Server started on port 3000');
});
