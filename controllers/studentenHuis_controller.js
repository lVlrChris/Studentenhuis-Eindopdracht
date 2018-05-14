

let  = require('../model/StudentHuis')

let personlist = []

// CRUD StudentenHuis

module.exports = {
    createStudentenhuis(req, res, next){
        console.log('createStudentenhuis was called');
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
