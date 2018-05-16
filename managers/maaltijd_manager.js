const maaltijd = require('../domain/Maaltijd');
const auth = require("../auth/authentication");
const db = require("../datasource/db");

let maaltijdList = [];

// CRUD Maaltijd

module.exports = {
    createMaaltijd(req, res, next){
        console.log('createMaaltijd was called');

        const name = req.body.naam || "";
        const desc = req.body.beschrijving || "";
        const ingr = req.body.ingredienten || "";
        const allergy = req.body.allergie || "";
        const price = req.body.prijs || "";
        const huisId = req.huisId || "";
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
                        //TODO: make maaltijd object with verifications (412)
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
                    "VALUES ('" + name + "', " +
                    "'" + desc + "', " +
                    "'" + ingr + "', " +
                    "'" + allergy + "', " +
                    "'" + price + "', " +
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
                            "naam": name,
                            "beschrijving": desc,
                            "ingredienten": ingr,
                            "allergie": allergy,
                            "prijs": price});
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