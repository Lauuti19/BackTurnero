const express = require('express');
const router = express.Router();
const { buscarUsuariosPorNombre, getUserFullInfo } = require('../controllers/usuariosController');

router.get('/buscar', buscarUsuariosPorNombre);

router.get('/:id_usuario', getUserFullInfo);

module.exports = router;