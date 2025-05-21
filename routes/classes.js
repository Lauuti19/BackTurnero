const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass, getUsersByClass } = require('../controllers/classesController');


router.get('/', getAllClasses);
router.get('/:userId', getClassesByUser);

router.post('/register', registerToClass);
router.get('/:classId/users', getUsersByClass);

module.exports = router;