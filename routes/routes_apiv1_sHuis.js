const express = require ("express");
const sHuisRouter = express.Router();
const sHuisManager = require('../managers/sHuis_manager');

sHuisRouter.post('/', sHuisManager.createStudentenhuis);
sHuisRouter.get('/', sHuisManager.getStudentenhuis);
sHuisRouter.get('/:huisId', sHuisManager.getStudentenhuisById);
sHuisRouter.put('/:huisId', sHuisManager.putStudentenhuis);
sHuisRouter.delete('/:huisId', sHuisManager.deleteStudentenhuis);

module.exports = sHuisRouter;