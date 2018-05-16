const db = require ("../datasource/db");
const Deelnemer = require ("../domain/Deelnemer");
const ApiError = require ("../domain/ApiError");

module.exports = {
    createDeelnemer(req, res, next) {
        console.log("createDeelnemer was called");

        //Gather submitted fields
        const userId = req.body.userid || "";
        const sHuisId = req.body.studentenhuisid || "";
        const maaltijdId = req.body.maaltijdid || "";

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
                        //TODO: Check of het sHuisId bestaat in de db
                        //TODO: Check of het maaltijdId bestaat in de db
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
    }
};