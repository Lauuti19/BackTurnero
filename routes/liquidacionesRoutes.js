// routes/liquidacionesRoutes.js
const express = require('express');
const router = express.Router();
const {
  getLiquidacionesCerradasByPeriod,
  getDetalleLiquidacionesByPeriod,
  getLiquidacionesProfesor,
  getResumenAsistenciasProfesor,
  getHistorialLiquidaciones
} = require('../controllers/liquidacionesReportController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');

// admin ve todo
router.get('/cerradas', authenticateToken, authorizeRole(['admin']), getLiquidacionesCerradasByPeriod);
router.get('/detalle', authenticateToken, authorizeRole(['admin']), getDetalleLiquidacionesByPeriod);

// profesor ve las suyas (y admin también)
router.get('/profesor', authenticateToken, authorizeRole(['admin', 'profesor']), getLiquidacionesProfesor);
router.get('/profesor/resumen', authenticateToken, authorizeRole(['admin', 'profesor']), getResumenAsistenciasProfesor);
router.get('/profesor/historial', authenticateToken, authorizeRole(['admin', 'profesor']), getHistorialLiquidaciones);

module.exports = router;
