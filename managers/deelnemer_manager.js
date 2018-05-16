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
        const userId = req.body.userid || "";
        const sHuisId = req.huisId || "";
        const maaltijdId = req.maaltijdId || "";

        if (userId !== "" && sHuisId !== "" && maaltijdId !== "") {
            newDeelnemer = new Deelnemer(userId, sHuisId, maaltijdId);
        }

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
                        //TODO: return Voornaam, Achternaam, email
                        res.status(200).json({
                            "message": "Deelnemer successvol toegevoegd.",
                            "userid": newDeelnemer.userId,
                            "huisid": newDeelnemer.sHuisId,
                            "maaltijdid": newDeelnemer.maaltijdId});

                    }
                });
            }
        });
    },

    getDeelnemer(req, res, next) {

        //Gather submitted fields
        const userToken = req.header("X-Access-Token") || "";
        let userId = "";
        const sHuisId = req.huisId || "";
        const maaltijdId = req.maaltijdId || "";


        //Decode token
        auth.decodeToken(userToken, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        userManager.getUser(2).then(function (res) {

        });

        //Get all matching deelnemers
        new Promise(function (resolve) {

            let checkQuery = {
                sql: "SELECT * FROM deelnemers " +
                "WHERE UserID = '" + userId + "' AND " +
                "StudentenhuisID = '" + sHuisId + "' AND " +
                "MaaltijdID = '" + maaltijdId + "';"
            };

            db.query(checkQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if(result.length > 0) {
                        console.log("Deelnemers Selected");
                        //TODO: Voornaam, Achternaam, Email

                        let deelnemers = [];


                        for (let i = 0; i > result.length; i++) {
                            deelnemers.push(new Student(result[i].Voornaam,
                                result[i].Achternaam,
                                result[i].Email,
                                result[i].Password));
                            console.log(result[i]);
                        }

                        console.log(deelnemers);

                        res.status(200).json({"message": "Gevonden deelnemers:", deelnemers});
                    } else {
                        console.log("Deelnemer doens't exist yet");
                        res.status(412).json(new ApiError("Deelnemer voor het huis en maatlijd bestaat niet", 412));
                    }
                }
            });

        });


    }
};