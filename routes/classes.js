const express = require('express');
const router = express.Router();
const { getClassesByUser, getAllClasses, registerToClass, getUsersByClass } = require('../controllers/classesController');


router.get('/all', getAllClasses);

router.get('/by-user', getClassesByUser);

router.get('/users-by-class', getUsersByClass); // <-- agrega esta línea

router.post('/register', registerToClass);

module.exports = router;