const express = require('express');
const router = express.Router();
const rdvController = require('../controller/rdvController');

router.get('/', rdvController.getAllRDV);
router.get('/old', rdvController.getAllOldRDV);
router.get('/pending', rdvController.getAllPendingRDV);
router.get('/:id', rdvController.getRDVById);
router.get('/getByPatient/:idPatient', rdvController.getAllRDVByPatient);
router.post('/:idPatient', rdvController.createRDV);
router.put('/:id', rdvController.updateRDV);
router.delete('/:id', rdvController.deleteRDV);

module.exports = router;
