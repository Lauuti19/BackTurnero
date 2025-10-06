const express = require('express');
const router = express.Router();
const {getDisciplinas, deleteDiscipline, createDiscipline} = require('../controllers/disciplinasController.js');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');


router.get('/', authenticateToken, getDisciplinas);
router.put('/delete', authenticateToken,authorizeRole(['admin','profesor']), deleteDiscipline);
router.post('/create', authenticateToken, authorizeRole(['admin','profesor']), createDiscipline);



module.exports = router;