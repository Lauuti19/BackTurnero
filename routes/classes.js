const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass,getUsersByClassAndDate, unregisterFromClass, createClass, getClassesByDay, updateClass, deleteClass, getClassesByUserNoCredits, updateAttendance, checkAttendanceQR,registerIndividualAttendance} = require('../controllers/classesController');
const { authorizeRole } = require('../middlewares/authMiddleware');
const { authenticateToken } = require('../middlewares/authenticateToken');


router.get('/all', authenticateToken, getAllClasses);

router.get('/by-user',authenticateToken, getClassesByUser);

router.post('/register',authenticateToken, registerToClass);

router.get('/users-by-class',authenticateToken, getUsersByClassAndDate),

router.post('/unregister',authenticateToken, unregisterFromClass);

router.post('/create',authenticateToken, authorizeRole(['admin','profesor']), createClass);

router.get('/by-day',authenticateToken, getClassesByDay);

router.put('/update',authenticateToken, authorizeRole(['admin','profesor']),updateClass);

router.put('/delete', authenticateToken,authorizeRole(['admin','profesor']), deleteClass);

router.get('/by-user-no-credits',authenticateToken, getClassesByUserNoCredits);

router.put(
  '/update-attendance',
  authenticateToken,
  authorizeRole(['admin', 'profesor']),
  updateAttendance
);

router.post('/check', authenticateToken, checkAttendanceQR);
router.put('/register-attendance', authenticateToken, registerIndividualAttendance);


module.exports = router;
