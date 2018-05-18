const Maaltijd = require('../domain/Maaltijd');
const auth = require("../auth/authentication");
const db = require("../datasource/db");
const ApiError = require ("../domain/ApiError");

let maaltijdList = [];

// CRUD Maaltijd

module.exports = {
    createMaaltijd(req, res, next){
        console.log('createMaaltijd was called');

        const huisId = req.huisId || "";
        const token = req.header("X-Access-Token") || "";
        let userId = "";
        let newMaaltijd;

        if (req.body.naam === "" ||
            req.body.beschrijving === "" ||
            req.body.ingredienten === "" ||
            req.body.allergie === "" ||
            req.body.prijs) {

            res.status(412).json(new ApiError("Een of meerdere velden zijn leeg.", 412));
        } else {
            newMaaltijd = new Maaltijd(req.body.naam,
                req.body.beschrijving,
                req.body.ingredienten,
                req.body.allergie,
                req.body.prijs);
        }

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });



        new Promise(function (resolve) {
            //Check if house exists
            let houseExists = false;

            let selectQuery = {
                sql: "SELECT * FROM studentenhuis " +
                "WHERE ID = '" + huisId + "';"
            };

            db.query(selectQuery, (error, result) => {
                if (error) {
                    next(error);
                } else {
                    if (result.length > 0) {
                        houseExists = true;
                        resolve(houseExists);
                    } else {
                        console.log("No houses found");
                        res.status(404).json(new ApiError("Geen studentenhuis gevonden met ID: " + huisId, 404))
                    }
                }
            });


        }).then(function (result) {

            //Create maaltijd
            if(result) {
                let insertQuery = {
                    sql: "INSERT INTO maaltijd (Naam, Beschrijving, Ingredienten, Allergie, Prijs, UserID, StudentenhuisID) " +
                    "VALUES ('" + newMaaltijd.naam + "', " +
                    "'" + newMaaltijd.beschrijving + "', " +
                    "'" + newMaaltijd.ingredienten + "', " +
                    "'" + newMaaltijd.allergie + "', " +
                    "'" + newMaaltijd.prijs + "', " +
                    "'" + userId + "', " +
                    "'" + huisId + "');"
                };

                db.query(insertQuery, function (error, result) {
                    if (error) {
                        next(error);
                    } else {
                        console.log("Maaltijd successfully inserted.");
                        res.status(200).json({
                            "ID": result.insertId,
                            "naam": newMaaltijd.name,
                            "beschrijving": newMaaltijd.beschrijving,
                            "ingredienten": newMaaltijd.ingredienten,
                            "allergie": newMaaltijd.allergie,
                            "prijs": newMaaltijd.prijs});
                    }
                });
            }
        });
    },

    getMaaltijd(req, res, next){
        console.log('getMaaltijd was called');

        //Gather submitted fields
        const huisId = req.huisId;

        new Promise((resolve)  => {
            const selectQuery = {
                sql: "SELECT * FROM maaltijd " +
                "WHERE StudentenhuisID = '" + huisId + "';"
            };

            db.query(selectQuery, function (error, result) {
                if(error) {
                    next(error);
                } else {
                    //Check if any results for query
                    if (result.length > 0) {
                        console.log("Maaltijd(en) found.");
                        let maaltijden = [];
                        for (let i = 0; i < result.length; i++) {
                            let newMaaltijd = new Maaltijd(
                                result[i].Naam,
                                result[i].Beschrijving,
                                result[i].Ingredienten,
                                result[i].Allergie,
                                result[i].Prijs);
                            newMaaltijd.setId(result[i].ID);
                            maaltijden.push(newMaaltijd);
                        }

                        resolve(maaltijden);

                    } else {
                        console.log("No Maaltijd(en) found.");
                        res.status(404).json(new ApiError("Geen maaltijd(en) gevonden.", 404));
                    }
                }
            });
        }).then(function (result) {
            res.status(200).json(result);
        });
    },
    getMaaltijdById(req, res, next){
        console.log('getMaaltijdById was called.');

        //Gather submitted fields
        const huisId = req.huisId;
        const maaltijdId = req.params.maaltijdId;

        new Promise((resolve)  => {
            const selectQuery = {
                sql: "SELECT * FROM maaltijd " +
                "WHERE StudentenhuisID = '" + huisId + "' AND " +
                "ID = '" + maaltijdId + "';"
            };

            db.query(selectQuery, function (error, result) {
                if(error) {
                    next(error);
                } else {
                    //Check if any results for query
                    if (result.length > 0) {
                        console.log("Maaltijd found.");
                        let maaltijden = [];
                        for (let i = 0; i < result.length; i++) {
                            let newMaaltijd = new Maaltijd(
                                result[i].Naam,
                                result[i].Beschrijving,
                                result[i].Ingredienten,
                                result[i].Allergie,
                                result[i].Prijs);
                            newMaaltijd.setId(result[i].ID);
                            maaltijden.push(newMaaltijd);
                        }

                        resolve(maaltijden);

                    } else {
                        console.log("No Maaltijd found.");
                        res.status(404).json(new ApiError("Geen maaltijd gevonden.", 404));
                    }
                }
            });
        }).then(function (result) {
            res.status(200).json(result);
        });
    },

    putMaaltijd(req, res, next){
        console.log('putMaaltijd was called.');

        //Gather submitted fields
        const huisId = req.huisId;
        const maaltijdId = req.params.maaltijdId;
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        //Changed maaltijd fields
        const newMaaltijd = new Maaltijd(req.body.naam, req.body.beschrijving, req.body.ingredienten, req.body.allergie, req.body.prijs);
        newMaaltijd.setUserId(userId);
        newMaaltijd.setHuisId(huisId);

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                next(err);
            } else {
                userId = payload.sub;
            }
        });

        new Promise(function (resolve) {
            const updateQuery = {
                sql: "UPDATE maaltijd " +
                "SET Naam = '" + newMaaltijd.naam + "', " +
                "Beschrijving = '" + newMaaltijd.beschrijving + "', " +
                "Ingredienten = '" + newMaaltijd.ingredienten + "', " +
                "Allergie = '" + newMaaltijd.allergie + "', " +
                "Prijs = '" + newMaaltijd.prijs + "' " +
                "WHERE StudentenhuisID = '" + huisId + "' AND " +
                "ID = '" + maaltijdId + "' AND " +
                "UserID = '" + userId + "';"
            };

            db.query(updateQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if (result.affectedRows > 0) {
                        console.log("Maaltijd succesfully updated");
                        resolve();
                    } else if (result.affectedRows === 0) {
                        console.log("No Maaltijd found.");
                        res.status(404).json(new ApiError("Geen maaltijd gevonden of geen eigenaar van Maaltijd."), 404);
                    }
                }
            });

        }).then(function (result) {

            new Promise((resolve)  => {
                const selectQuery = {
                    sql: "SELECT * FROM maaltijd " +
                    "WHERE StudentenhuisID = '" + huisId + "' AND " +
                    "ID = '" + maaltijdId + "';"
                };

                db.query(selectQuery, function (error, result) {
                    if(error) {
                        next(error);
                    } else {
                        //Check if any results for query
                        if (result.length > 0) {
                            console.log("Maaltijd found.");
                            let maaltijden = [];
                            for (let i = 0; i < result.length; i++) {
                                let newMaaltijd = new Maaltijd(
                                    result[i].Naam,
                                    result[i].Beschrijving,
                                    result[i].Ingredienten,
                                    result[i].Allergie,
                                    result[i].Prijs);
                                newMaaltijd.setId(result[i].ID);
                                maaltijden.push(newMaaltijd);
                            }

                            resolve(maaltijden);

                        } else {
                            console.log("No Maaltijd found.");
                            res.status(404).json(new ApiError("Geen maaltijd gevonden.", 404));
                        }
                    }
                });
            }).then(function (result) {
                res.status(200).json(result);
            });
        });
    },

    deleteMaaltijd(req, res, next){
        console.log('deleteMaaltijd was called.');

        //Gather submitted fields
        const huisId = req.huisId;
        const maaltijdId = req.params.maaltijdId;
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
            const deleteQuery = {
                sql: "DELETE FROM maaltijd " +
                "WHERE StudentenhuisID = '" + huisId + "' AND " +
                "ID = '" + maaltijdId + "' AND " +
                "UserID = '" + userId + "';"
            };

            db.query(deleteQuery, function (error, result) {
                if (error) {
                    next(error);
                } else {
                    if (result.affectedRows > 0) {
                        console.log("Maaltijd successfully deleted.");
                        res.status(200).json({"message": "Maaltijd succesvol verwijderd."});
                    } else if (result.affectedRows === 0) {
                        console.log("No Maaltijd found");
                        res.status(404).json(new ApiError("Geen maaltijd gevonden", 404));
                    }
                }
            });
        });
    }
};