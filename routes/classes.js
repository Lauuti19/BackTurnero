const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass,getUsersByClassAndDate, unregisterFromClass, createClass} = require('../controllers/classesController');


router.get('/all', getAllClasses);

router.get('/by-user', getClassesByUser);

router.post('/register', registerToClass);

router.get('/users-by-class', getUsersByClassAndDate),

router.post('/unregister', unregisterFromClass);

router.post('/create', createClass)



module.exports = router;
