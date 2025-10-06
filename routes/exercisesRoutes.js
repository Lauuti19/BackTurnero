const express = require('express');
const router = express.Router();
const {getAllExercises, searchExercisesByName, createExercise, updateExercise, deleteExercise} = require('../controllers/exercisesController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', authenticateToken,getAllExercises);
router.get('/search',authenticateToken, searchExercisesByName);
router.post('/create',authenticateToken,authorizeRole(['admin','profesor']), createExercise);
router.put('/update', authenticateToken,authorizeRole(['admin','profesor']),updateExercise);
router.put('/delete',authenticateToken, authorizeRole(['admin','profesor']),deleteExercise);


module.exports = router;
