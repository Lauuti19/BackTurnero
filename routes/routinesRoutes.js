const express = require('express');
const router = express.Router();
const {createUserRoutineWithExercises, getRoutinesByUser, getRoutinesByUserName, updateUserRoutine,deleteUserRoutine} = require('../controllers/routinesController.js');

router.post('/create', createUserRoutineWithExercises);
router.get('/user/:userId', getRoutinesByUser);
router.get('/search', getRoutinesByUserName);
router.put('/update', updateUserRoutine);
router.put('/delete', deleteUserRoutine);

module.exports = router;
