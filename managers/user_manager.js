const db = require("../datasource/db");
const ApiError = require ("../domain/ApiError");
const auth = require ("../auth/authentication");
const Student = require ("../domain/Student");


//CRUD for users
module.exports = {
    createUser(req, res, next) {
        console.log("createUser was called.");

        //Gather submitted fields
        // const firstName = req.body.firstname || "";
        // const lastName  = req.body.lastname || "";
        // const email = req.body.email || "";
        // const password = req.body.password || "";
        //
        // newStudent = new Student(firstName, lastName, email, password);

        //TODO: Encrypt passwords
        let newStudent = new Student(req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password);

        //In a promise to chain queries
        new Promise(function (resolve) {

            //Check if user already exists.
            let checkQuery = {
                sql: "SELECT * FROM user " +
                "WHERE Email = '" + newStudent.email + "';"
            };

            db.query(checkQuery, function (error, result) {
                //Check query errors
                if (error) {
                    next(error);
                } else {
                    //Check if a user already exists
                    if(result.length > 0) {
                        res.status(412).json(new ApiError("Gebruiker met ingevoerde email bestaat al", 412));
                    } else {
                        console.log("No existing user found");
                        resolve(false);
                    }

                }
            });

        }).then(function (result) {
            //Insert user in database
            console.log(result);
            console.log("userExists: " + result + " Student valid: " + newStudent.getValidation());
            if(!result && newStudent.getValidation()) {
                let insertQuery = {
                    sql: "INSERT INTO user (Voornaam, Achternaam, Email, Password)" +
                    "VALUES ('" + newStudent.firstName + "', '"
                    + newStudent.lastName + "', '"
                    + newStudent.email + "', '"
                    + newStudent.password + "');"
                };

                db.query(insertQuery, function (error, results) {
                    if (error) {
                        next(error);
                    } else {
                        console.log("Student succesfully inserted.");
                        newStudent.setID(results.insertId);
                        res.status(200).json({"token": auth.encodeToken(newStudent.id), "email": newStudent.email, "userId": newStudent.id});
                    }
                });
            }
        });
    },

    loginUser(req, res, next) {

        //Get username and password
        const email = req.body.email || "";
        const password = req.body.password || "";

        //Check existing user
        resultUser = new Promise(function (resolve) {

            let checkQuery = {
                sql: "SELECT * FROM user " +
                "WHERE Email = '" + email + "';"
            };

            db.query(checkQuery, function (error, result) {
                //Check query errors
                if (error) {
                    next(error);
                } else {
                    //Check if a user exists
                    if(result.length > 0) {
                        console.log("User found");
                        resolve(result);
                    } else {
                        console.log("User not found");
                        resolve(null);
                    }

                }
            });

        });

        //Check login credentials
        resultUser.then(function (result) {
            let resultEmail = result[0].Email;
            let resultPassword = result[0].Password;

            if(resultEmail === email && resultPassword === password) {
                console.log("Correct login credentials");
                //Make token for user
                res.status(200).json({"token" : auth.encodeToken(result[0].ID), "email" : email});
            } else {
                console.log("Incorrect login credentials");
                res.status(412).json(new ApiError("Incorrect login credentials", 412));
            }
        });
    },

    getUser(userId) {
        return new Promise(function (resolve) {

            let selectQuery = {
                sql: "SELECT * FROM user " +
                "WHERE ID = '" + userId + "';"
            };

            db.query(selectQuery, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    let searchedStudent = new Student(result[0].Voornaam, result[0].Achternaam, result[0].Email, result[0].Password);
                    searchedStudent.setID(result[0].ID);
                    resolve(searchedStudent);
                }
            });
        });
    },

    getUsers() {
        return new Promise(function (resolve) {
            let selectQuery = {
                sql: "SELECT * FROM user;"
            };

            db.query(selectQuery, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    let students = [];

                    for (let i = 0; i < 0; i++) {
                        let newStudent = new Student(result[i].Voornaam, result[i].Achternaam, result[i].Email, result[i].Password);
                        newStudent.setID(result[i].ID);
                        students.push(newStudent);
                    }

                    resolve(students);
                }
            });
        });
    }
};
