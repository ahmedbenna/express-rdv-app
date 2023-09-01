const express = require('express');
const router = express.Router();
const registerController = require('../controller/registerController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/',verifyJWT, registerController.handleNewUser);

module.exports = router;