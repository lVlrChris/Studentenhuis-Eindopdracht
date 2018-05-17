const Maaltijd = require('../domain/Maaltijd');
const auth = require("../auth/authentication");
const db = require("../datasource/db");

let maaltijdList = [];

// CRUD Maaltijd

module.exports = {
    createMaaltijd(req, res, next){
        console.log('createMaaltijd was called');

        const huisId = req.huisId || "";
        const token = req.header("X-Access-Token") || "";
        let userId = "";

        let newMaaltijd = new Maaltijd(req.body.naam,
            req.body.beschrijving,
            req.body.ingredienten,
            req.body.allergie,
            req.body.prijs);

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
                        //TODO: maaltijd object verifications (412)
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
        res.status(200).end();
    },
    getMaaltijdById(req, res, next){
        console.log('getMaaltijdById was called.');
        res.status(200).end();
    },
    putMaaltijd(req, res, next){
        console.log('putMaaltijd was called.');
        res.status(200).end();
    },
    deleteMaaltijd(req, res, next){
        console.log('deleteMaaltijd was called.');
        res.status(200).end();
    }

};