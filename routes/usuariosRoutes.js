const express = require('express');
const router = express.Router();
const { buscarUsuariosPorNombre, getUserFullInfo, updateUserInfo, getProfesAndAdmins } = require('../controllers/usuariosController');

router.get('/buscar', buscarUsuariosPorNombre);

router.get('/:id_usuario', getUserFullInfo);

router.get('/profes-admins/buscar', getProfesAndAdmins);

router.put('/update', updateUserInfo);

module.exports = router;