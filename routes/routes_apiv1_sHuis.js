const express = require('express');
const router = express.Router();
const sHuis_manager = require('../managers/sHuis_manager');

router.post('/api/studentenhuis', sHuis_manager.createStudentenhuis);
router.get('/api/studentenhuis', sHuis_manager.getStudentenhuis);
router.get('/api/studentenhuis/:huisId', sHuis_manager.getStudentenhuisById);
router.put('/api/studentenhuis/:huisId', sHuis_manager.putStudentenhuis);
router.delete('/api/studentenhuis/:huisId', sHuis_manager.deleteStudentenhuis);

module.exports = router;