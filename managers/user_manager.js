const db = require("../datasource/db");
const ApiError = require ("../domain/ApiError");
const auth = require ("../auth/authentication");
const Student = require ("../domain/Student");


//CRUD for users
module.exports = {
    createUser(req, res, next) {
        console.log("createUser was called.");

        //Gather submitted fields
        const firstName = req.body.firstname || "";
        const lastName  = req.body.lastname || "";
        const email = req.body.email || "";
        const password = req.body.password || "";

        newStudent = new Student(firstName, lastName, email, password);

        //In a promise to chain queries
        let promise = new Promise(function (resolve) {

            //Check if user already exists.
            let checkQuery = {
                sql: "SELECT * FROM user " +
                "WHERE Email = '" + newStudent.email + "';"
            };

            let userExists = true;

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
    }


};