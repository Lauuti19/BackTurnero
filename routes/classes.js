const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses } = require('../controllers/classesController');


router.get('/', getAllClasses);
router.get('/:userId', getClassesByUser);


module.exports = router;
