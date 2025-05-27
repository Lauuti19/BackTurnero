const express = require('express');
const router = express.Router();
const { getInfoCuotas, registrarCuotaPorNombre } = require('../controllers/paymentsController');

router.get('/info-cuotas', getInfoCuotas);
router.post('/registrar-cuota', registrarCuotaPorNombre); 

module.exports = router;