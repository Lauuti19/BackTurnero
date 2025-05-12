const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass } = require('../controllers/classesController');


router.get('/', getAllClasses);
router.get('/:userId', getClassesByUser);

router.post('/register', registerToClass);

module.exports = router;
