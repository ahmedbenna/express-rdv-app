const express = require('express');
const router = express.Router();
const registerController = require('../controller/registerController');
const verifyJWTDoctor = require('../middleware/verifyJWT');

router.post('/',verifyJWTDoctor, registerController.handleNewUser);

module.exports = router;