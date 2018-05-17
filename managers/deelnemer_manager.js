const db = require ("../datasource/db");
const Deelnemer = require ("../domain/Deelnemer");
const ApiError = require ("../domain/ApiError");
const auth = require ("../auth/authentication");
const userManager = require ("../managers/user_manager");
const Student = require ("../domain/Student");

module.exports = {
    createDeelnemer(req, res, next) {
        console.log("createDeelnemer was called");

        //Gather submitted fields
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        let newDeelnemer = new Deelnemer(userId, req.huisId, req.maaltijdId);

        new Promise(function (resolve) {

            //Check if deelnemer already exists
            let checkQuery = {
                sql: "SELECT * FROM deelnemers " +
                "WHERE UserID = '" + newDeelnemer.userId + "' AND " +
                "StudentenhuisID = '" + newDeelnemer.sHuisId + "' AND " +
                "MaaltijdID = '" + newDeelnemer.maaltijdId + "';"
            };

            db.query(checkQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if(result.length > 0) {
                        console.log("Deelnemer already exists");
                        res.status(412).json(new ApiError("Deelnemer bestaat al", 412));
                    } else {
                        console.log("Deelnemer doens't exist yet");
                        resolve(result);
                    }
                }
            });

        }).then(function (result) {

            //Check if sHuisId exists
            let checkQuery = {
                sql: "SELECT * FROM studentenhuis " +
                "WHERE ID = '" + newDeelnemer.sHuisId + "';"
            };

            db.query(checkQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if(result.length > 0) {
                        console.log("Studentenhuis does exist");
                        //send to next .then
                        return result;
                    } else {
                        console.log("Studentenhuis doesn't exist");
                        res.status(404).json(new ApiError("Studentenhuis bestaat niet", 404));
                    }
                }
            });

        }).then(function (result) {

            //Check if maaltijdId exists
            let checkQuery = {
                sql: "SELECT * FROM maaltijd " +
                "WHERE ID = '" + newDeelnemer.maaltijdId + "';"
            };

            db.query(checkQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if(result.length > 0) {
                        console.log("Maaltijd does exist");
                        //send to next .then
                        return result;
                    } else {
                        console.log("Maaltijd doesn't exist");
                        res.status(404).json(new ApiError("Maaltijd bestaat niet", 404));
                    }
                }
            });

        }).then(function (result) {
            //Insert deelnemer
            if(!result) {
                let insertQuery = {
                    sql: "INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID)" +
                    "VALUES ('" + newDeelnemer.userId + "', " +
                    "'" + newDeelnemer.sHuisId + "', " +
                    "'" + newDeelnemer.maaltijdId + "');"
                };

                db.query(insertQuery, function (error, result) {
                    if (error) {
                        next(error);
                    } else {
                        console.log("Deelnemer succesfully inserted.");

                        let dStudent = userManager.getUser(newDeelnemer.userId).then(function (result) {
                            return result;
                        });

                        res.status(200).json({
                            "message": "Deelnemer successvol toegevoegd.",
                            "voornaam": dStudent.voornaam,
                            "achternaam": dStudent.achternaam,
                            "email": dStudent.email});
                    }
                });
            }
        });
    },

    getDeelnemers(req, res, next) {
        console.log("getDeelnemers called.");

        //Get submitted fields
        const huisId = req.huisId;
        const maaltijdId = req.maaltijdId;

        new Promise(function (resolve) {

            let selectQuery = {
                sql: "SELECT * FROM deelnemers " +
                "WHERE StudentenhuisID = '" + huisId + "' AND " +
                "MaaltijdID = '" + maaltijdId + "';"
            };

            db.query(selectQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {

                    if (result.length > 0) {
                        let deelnemers = [];
                        for (let i = 0; i < result.length; i++) {
                            let newDeelnemer = new Deelnemer(result[i].UserID, result[i].StudenthuisID, result[i].MaaltijdID);
                            deelnemers.push(newDeelnemer);
                        }
                        resolve(deelnemers);
                    } else {
                        res.status(404).json(new ApiError("Geen deelnemers gevonden voor dit studentenhuis en maaltijd.", 404));
                    }
                }
            });
        }).then(function (result1) {
            let finalResult = [];

            //Formatting result to show names, email, ect.
            for (let i = 0; i < result1.length; i++) {

                userManager.getUser(result1[i].userId).then(function (result) {

                    let entry = {"voornaam": result.firstName, "achternaam": result.lastName, "email": result.email};
                    finalResult.push(entry);

                }).then(function (result) {

                    //Resonse in .then to keep sync
                    if(i === (result1.length - 1)) {
                        console.log("Final result: " + finalResult);
                        res.status(200).json(finalResult);
                    }

                });
            }
        });
    },

    deleteDeelnemer(req, res, next) {
        console.log("deleteDeelnemer is called");

        //Get submitted fields
        const huisId = req.huisId;
        const maatlijdId = req.maaltijdId;
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        //Check if deelnemer exists
        new Promise(function (resolve) {
            let selectQuery = {
                sql: "SELECT * FROM deelnemers " +
                "WHERE UserID = '" + userId + "' AND " +
                "StudentenhuisID = '" + huisId + "' AND " +
                "MaaltijdID = '" + maatlijdId + "';"
            };

            db.query(selectQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if(result.length > 0) {
                        console.log("Chosen deelnemer exists");
                        resolve(true);
                    } else {
                        console.log("Chosen deelnemer doesn't exist");
                        res.status(404).json(new ApiError("Deelnemer voor het gekozen huis en maaltijd niet gevonden."), 404);
                        resolve(false);
                    }
                }
            });
        }).then(function (result) {

            if (result) {
                let deleteQuery = {
                    sql: "DELETE FROM deelnemers " +
                    "WHERE UserID = '" + userId + "' AND " +
                    "StudentenhuisID = '" + huisId + "' AND " +
                    "MaaltijdID = '" + maatlijdId + "';"
                };

                db.query(deleteQuery, function (error, result) {
                    if(error) {
                        next(error);
                    } else {
                        res.status(200).json({"message": "Deelnemer succesvol verwijderd."});
                    }
                });
            }
        });
    }
};