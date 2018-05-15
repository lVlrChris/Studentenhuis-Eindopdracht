const express = require('express');
const sHuisRouter = express.Router();
const sHuis_manager = require('../managers/sHuis_manager');

sHuisRouter.post('/', sHuis_manager.createStudentenhuis);
sHuisRouter.get('/', sHuis_manager.getStudentenhuis);
sHuisRouter.get('/:huisId', sHuis_manager.getStudentenhuisById);
sHuisRouter.put('/:huisId', sHuis_manager.putStudentenhuis);
sHuisRouter.delete('/:huisId', sHuis_manager.deleteStudentenhuis);

module.exports = sHuisRouter;