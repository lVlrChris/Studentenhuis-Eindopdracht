

let routes = require('express').Router()
let maaltijd_controller = require('../controllers/maaltijd_controller')

// hier schrijven we router endpoints
routes.get('/', maaltijd_controller.getMaaltijd)
routes.post('/', maaltijd_controller.createMaaltijd)

routes.get('/:id', maaltijd_controller.getMaaltijdById)
routes.put('/:id', maaltijd_controller.putMaaltijd)
routes.delete('/:id', maaltijd_controller.deleteMaaltijd)

module.exports = routes


