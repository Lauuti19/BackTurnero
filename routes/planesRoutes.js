const express = require('express');
const router = express.Router();
const { getPlanes } = require('../controllers/planesController');

router.get('/', getPlanes);

module.exports = router;