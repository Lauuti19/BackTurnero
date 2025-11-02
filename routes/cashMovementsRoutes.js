const express = require('express');
const router = express.Router();
const { 
  registerCashMovement,
  getAllCashMovements,
  getCashMovementsByDateRange,
  getTodayCashMovements,
  getTodayCashSummary,
  getCashEfectivoDisponible,
  getCashSummaryByPaymentMethod,
  registerCashOut,
  getTotalCashByPeriod,
  getEgresosByPeriod,
  getCajaActiva,
  cerrarCajaMensual,
} = require('../controllers/cashMovementsController');

const { authorizeRole } = require('../middlewares/authMiddleware');
const { authenticateToken } = require('../middlewares/authenticateToken');

router.get('/all', authenticateToken, authorizeRole(['admin','profesor']), getAllCashMovements);                   
router.get('/by-date-range', authenticateToken, authorizeRole(['admin','profesor']), getCashMovementsByDateRange); 
router.get('/today', authenticateToken, authorizeRole(['admin','profesor']), getTodayCashMovements);               
router.post('/register', authenticateToken, authorizeRole(['admin', 'profesor']), registerCashMovement);         

// Resúmenes
router.get('/summary/today', authenticateToken, authorizeRole(['admin']), getTodayCashSummary);             
router.get('/summary/efectivo', authenticateToken, authorizeRole(['profesor','admin']), getCashEfectivoDisponible); 
router.get('/summary/by-payment', authenticateToken, authorizeRole(['admin']), getCashSummaryByPaymentMethod);    
router.post('/egreso', authenticateToken, authorizeRole(['admin','profesor']), registerCashOut);
router.get('/summary/by-period', authenticateToken, authorizeRole(['admin','profesor']), getTotalCashByPeriod);
router.get('/egresos/by-period', authenticateToken, authorizeRole(['admin','profesor']), getEgresosByPeriod);


router.get(
  '/caja/activa',
  authenticateToken,
  authorizeRole(['admin']),
  getCajaActiva
);

router.post(
  '/caja/cerrar',
  authenticateToken,
  authorizeRole(['admin']),
  cerrarCajaMensual
);
module.exports = router;
