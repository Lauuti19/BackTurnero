const express = require('express');
const router = express.Router();
const {createUserRoutineWithExercises, getRoutinesByUser, getRoutinesByUserName, updateUserRoutine,deleteUserRoutine} = require('../controllers/routinesController.js');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');


router.post('/create',authenticateToken, authorizeRole(['admin','profesor']),createUserRoutineWithExercises);
router.get('/user/:userId', authenticateToken,getRoutinesByUser);
router.get('/search', authenticateToken,getRoutinesByUserName);
router.put('/update',authenticateToken, authorizeRole(['admin','profesor']),updateUserRoutine);
router.put('/delete',authenticateToken, authorizeRole(['admin','profesor']), deleteUserRoutine);

module.exports = router;
