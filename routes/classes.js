const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass,getUsersByClassAndDate, unregisterFromClass, createClass, getClassesByDay, updateClass, deleteClass, getClassesByUserNoCredits} = require('../controllers/classesController');


router.get('/all', getAllClasses);

router.get('/by-user', getClassesByUser);

router.post('/register', registerToClass);

router.get('/users-by-class', getUsersByClassAndDate),

router.post('/unregister', unregisterFromClass);

router.post('/create', createClass);

router.get('/by-day', getClassesByDay);

router.put('/update', updateClass);

router.put('/delete', deleteClass);

router.get('/by-user-no-credits', getClassesByUserNoCredits);



module.exports = router;
