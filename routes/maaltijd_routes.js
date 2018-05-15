

let routes = require('express').Router()
let maaltijd_controller = require('../controllers/maaltijd_controller')

// hier schrijven we router endpoints
routes.get('/api/studentenhuis/:huisId/maaltijd', maaltijd_controller.getMaaltijd)
routes.post('/', maaltijd_controller.createMaaltijd)

routes.get('/api/studentenhuis/:huisId/maaltijd/:maaltijdId', maaltijd_controller.getMaaltijdById)
routes.put('/api/studentenhuis/:huisId/maaltijd/:maaltijdId', maaltijd_controller.putMaaltijd)
routes.delete('/api/studentenhuis/:huisId/maaltijd/:maaltijdId', maaltijd_controller.deleteMaaltijd)

module.exports = routes


