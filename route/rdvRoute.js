const express = require('express');
const router = express.Router();
const rdvController = require('../controller/rdvController');

router.get('/', rdvController.getAllRDV);
router.get('/:id', rdvController.getRDVById);
router.post('/:patientId', rdvController.createRDV);
router.put('/:id', rdvController.updateRDV);
router.delete('/:id', rdvController.deleteRDV);

module.exports = router;