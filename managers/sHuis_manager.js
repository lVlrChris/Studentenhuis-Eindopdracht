const db = require('../datasource/db');

// CRUD StudentenHuis

module.exports = {
    createStudentenhuis(req, res, next){
        console.log('createStudentenhuis was called');
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
        res.status(200).end();
    },

    getStudentenhuisById(req, res, next){
        console.log('getStudentenhuisById was called.');
        res.status(200).end();
    },

    putStudentenhuis(req, res, next){
        console.log('putStudentenhuis was called.');
        res.status(200).end();
    },

    deleteStudentenhuis(req, res, next){
        console.log('deleteStudentenhuis was called.');
        res.status(200).end();
    }

};