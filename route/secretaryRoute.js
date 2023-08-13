const express = require('express');
const router = express.Router();
const secretaryController = require('../controller/secretaryController');

router.get('/', secretaryController.getAllSecretary);
router.post('/login', secretaryController.loginSecretary);
router.get('/:id', secretaryController.getSecretaryById);
router.post('/', secretaryController.createSecretary);
router.put('/:id', secretaryController.updateSecretary);
router.delete('/:id', secretaryController.deleteSecretary);

module.exports = router;
