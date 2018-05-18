const db = require('../datasource/db');
const auth = require ("../auth/authentication");
const ApiError = require ("../domain/ApiError");

// CRUD StudentenHuis

module.exports = {
    createStudentenhuis(req, res, next){
        console.log('createStudentenhuis was called');

        //TODO: Make SHuis object for verificaiton.
        let query = {
            sql : 'INSERT INTO `studentenhuis` (`Adres`, `Naam`, `UserID`) VALUES (\'' + req.body.adres + '\', \'' + req.body.naam + '\', \'' + req.body.id + '\');',
        };


        db.query(query, function(error, rows){

            if(error) {
                //Als de database een error gooit doe je dit
                next(error);
            } else {
                let id = rows.insertId;

                //Bouwt query op
                let query = {
                    sql: 'SELECT studentenhuis.ID, studentenhuis.Naam, studentenhuis.Adres, CONCAT(user.Voornaam, \' \', user.Achternaam) AS Contact, user.Email FROM `studentenhuis` JOIN user ON user.ID = studentenhuis.UserID WHERE studentenhuis.ID = ' + id,
                };

                //Voert query uit
                db.query(query, function(error, rows){
                    if(error) {
                        //Als de database een error gooit doe je dit
                        next(error);
                    } else {
                        //Alle resultaten van de query terugsturen
                        res.status(200).json(rows[0]);
                    }
                });
            }
        });

    },

    getStudentenhuis(req, res, next){
        console.log('getStudentenhuis was called');

        let selectQuery = {
            sql: "SELECT * FROM studentenhuis;"
        };

        db.query(selectQuery, (error, result) => {
            if(error) {
                next(error);
            } else {
                if (result > 0) {
                    console.log("House found");
                    res.status(200).json(result);
                } else {
                    console.log("No houses found");
                    res.status(404).json(new ApiError("No houses found", 404));
                }
            }
        });
    },

    getStudentenhuisById(req, res, next){
        console.log('getStudentenhuisById was called.');

        const sHuisId = req.params.huisId || "";

        let selectQuery = {
            sql: "SELECT * FROM studentenhuis " +
            "WHERE ID = '" + sHuisId + "';"
        };

        db.query(selectQuery, (error, result) => {
            if(error) {
                next(error);
            } else {
                if (result > 0) {
                    console.log("House found");
                    res.status(200).json(result[0]);
                } else {
                    console.log("No houses found");
                    res.status(404).json(new ApiError("No houses found", 404));
                }
            }
        });
    },

    putStudentenhuis(req, res, next){
        console.log('putStudentenhuis was called.');

        const huisId = req.params.huisId || "";
        const name = req.body.naam || "";
        const adress = req.body.adres || "";
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        new Promise(function (resolve) {

            //Check houseID and correct owner
            let houseExists = false;

            let selectQuery = {
                sql: "SELECT * FROM studentenhuis " +
                "WHERE ID = '" + huisId + "' AND " +
                "UserID = '" + userId + "';"
            };

            db.query(selectQuery, (error, result) => {
                if (error) {
                    next(error);
                } else {
                    if (result.length > 0) {
                        houseExists = true;
                        resolve(houseExists);
                    } else {
                        console.log("No applicable houses found");
                        res.status(404).json(new ApiError("Geen studentenhuis gevonden van eigenaar: " + userId + " met ID: " + huisId, 404))
                    }
                }
            });

        }).then(function (result) {

            //Change entry data
            let updateQuery = {
                sql: "UPDATE studentenhuis " +
                "SET Naam = '" + name + "', " +
                "Adres = '" + adress + "' " +
                "WHERE ID = '" + huisId + "' AND " +
                "UserID = '" + userId + "';"
            };

            if (result) {
                db.query(updateQuery, (error, result) => {
                    if (error) {
                        next(error);
                    } else {
                        console.log("Studentenhuis successfully changed.");
                        res.status(200).json({"ID": huisId,
                        "naam": name,
                        "adres": adress,
                        "userid": userId});
                    }
                });
            }
        });
    },

    deleteStudentenhuis(req, res, next){
        console.log('deleteStudentenhuis was called.');

        const huisId = req.params.huisId || "";
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        new Promise(function (resolve) {

            //Check houseID and correct owner
            let houseExists = false;

            let selectQuery = {
                sql: "SELECT * FROM studentenhuis " +
                "WHERE ID = '" + huisId + "' AND " +
                "UserID = '" + userId + "';"
            };

            db.query(selectQuery, (error, result) => {
                if (error) {
                    next(error);
                } else {
                    if (result.length > 0) {
                        houseExists = true;
                        resolve(houseExists);
                    } else {
                        console.log("No applicable houses found");
                        res.status(404).json(new ApiError("Geen studentenhuis gevonden van eigenaar: " + userId + " met ID: " + huisId, 404))
                    }
                }
            });

        }).then(function (result) {

            //Delete entry
            if(result) {
                let deleteQuery = {
                    sql: "DELETE FROM studentenhuis " +
                    "WHERE ID = '" + huisId + "' AND " +
                    "UserID = '" + userId + "';"
                };

                db.query(deleteQuery, (error, result) => {
                    if(error) {
                        next(error);
                    } else {
                        console.log("Studentenhuis successfully deleted");
                        res.status(200).json({"message": "Studentenhuis succesvol verwijderd"});
                    }
                });
            }
        });
    }

};