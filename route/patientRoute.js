const express = require('express');
const router = express.Router();
const patientController = require('../controller/patientController');

router.get('/', patientController.getAllPatients);
// router.post('/login', patientController.loginPatient);
router.get('/:id', patientController.getPatientById);
router.get('/find/:patient', patientController.find);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;
