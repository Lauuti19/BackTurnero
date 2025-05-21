const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass} = require('../controllers/classesController');


router.get('/all', getAllClasses);

router.get('/by-user', getClassesByUser);

router.post('/register', registerToClass);

module.exports = router;
