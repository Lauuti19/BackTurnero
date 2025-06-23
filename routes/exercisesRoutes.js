const express = require('express');
const router = express.Router();
const {getAllExercises, searchExercisesByName, createExercise, updateExercise, deleteExercise} = require('../controllers/exercisesController');

router.get('/', getAllExercises);
router.get('/search', searchExercisesByName);
router.post('/create', createExercise);
router.put('/update', updateExercise);
router.put('/delete', deleteExercise);


module.exports = router;
