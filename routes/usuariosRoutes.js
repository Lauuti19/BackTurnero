const express = require('express');
const router = express.Router();
const { buscarUsuariosPorNombre, getUserFullInfo, updateUserInfo, getProfesAndAdmins } = require('../controllers/usuariosController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');


router.get('/buscar', authenticateToken,buscarUsuariosPorNombre);

router.get('/:id_usuario', authenticateToken,getUserFullInfo);

router.get('/profes-admins/buscar', authenticateToken,getProfesAndAdmins);

router.put('/update', authenticateToken,updateUserInfo);

module.exports = router;