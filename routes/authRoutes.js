const express = require('express');
const router = express.Router();
const { registerClient } = require('../controllers/authController');

router.post('/register', registerClient);

module.exports = router;
