const express = require('express');
const router = express.Router();
const { buscarUsuariosPorNombre } = require('../controllers/usuariosController');

router.get('/buscar', buscarUsuariosPorNombre);

module.exports = router;