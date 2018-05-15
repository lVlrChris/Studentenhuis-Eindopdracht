const express = require ("express");
const maaltijdRouter = express.Router();
const maaltijd_manager = require("../managers/maaltijd_manager");

// hier schrijven we router endpoints
maaltijdRouter.post('/', maaltijd_manager.createMaaltijd);
maaltijdRouter.get('/', maaltijd_manager.getMaaltijd);
maaltijdRouter.get('/:maaltijdId', maaltijd_manager.getMaaltijdById);
maaltijdRouter.put('/:maaltijdId', maaltijd_manager.putMaaltijd);
maaltijdRouter.delete('/:maaltijdId', maaltijd_manager.deleteMaaltijd);

module.exports = maaltijdRouter;

