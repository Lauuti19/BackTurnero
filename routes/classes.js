const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass,getUsersByClassAndDate} = require('../controllers/classesController');


router.get('/all', getAllClasses);

router.get('/by-user', getClassesByUser);

router.post('/register', registerToClass);

router.get('/users-by-class', getUsersByClassAndDate)

module.exports = router;
