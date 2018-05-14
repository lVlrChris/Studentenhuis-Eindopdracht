

let  = require('../model/Maaltijd')

let MaaltijdList = []

// CRUD Maaltijd

module.exports = {
    createMaaltijd(req, res, next){
        console.log('createMaaltijd was called');
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