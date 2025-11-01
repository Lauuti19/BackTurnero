const express = require('express');
const router = express.Router();
const { buscarUsuariosPorNombre, getUserFullInfo, updateUserInfo, getProfesAndAdmins } = require('../controllers/usuariosController');

router.get('/profes-admins/buscar', getProfesAndAdmins);

router.get('/buscar', buscarUsuariosPorNombre);

router.get('/:id_usuario', getUserFullInfo);


router.put('/update', updateUserInfo);

module.exports = router;