// routes/workHoursRoutes.js
const express = require('express');
const router = express.Router();
const {
  createWorkHours,
  getWorkHours,
  liquidarProfesor,
  registrarCheckIn,
  registrarCheckOut,
  softDeleteWorkHours,
  updateWorkHours,
  getWorkedHours,
  getWorkedHoursByRange,
  getAsistenciasProfes,
  getHorasTrabajadasProfes,
  getPreLiquidacionProfesor,
  getLiquidacionesPorRango,
  getAttendanceStatus,
  getCheckStatusDia
} = require('../controllers/workHoursController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.post('/create', authenticateToken, authorizeRole(['admin']), createWorkHours);
router.get('/list', authenticateToken, authorizeRole(['admin']), getWorkHours);
router.post('/liquidar', authenticateToken, authorizeRole(['admin']), liquidarProfesor);

router.post('/checkin', authenticateToken, authorizeRole(['admin', 'profesor']), registrarCheckIn);
router.post('/checkout', authenticateToken, authorizeRole(['admin', 'profesor']), registrarCheckOut);

router.delete('/delete/:id_pactado', authenticateToken, authorizeRole(['admin']), softDeleteWorkHours);
router.put('/update', authenticateToken, authorizeRole(['admin']), updateWorkHours);

router.get('/worked-hours', authenticateToken, authorizeRole(['admin']), getWorkedHours);
router.get('/worked-hours-range', authenticateToken, authorizeRole(['admin']), getWorkedHoursByRange);

router.get('/asistencias', authenticateToken, authorizeRole(['admin']), getAsistenciasProfes);
router.get('/horas-profes', authenticateToken, authorizeRole(['admin']), getHorasTrabajadasProfes);

router.get('/pre-liquidacion', authenticateToken, authorizeRole(['admin']), getPreLiquidacionProfesor);
router.get('/liquidaciones', authenticateToken, authorizeRole(['admin']), getLiquidacionesPorRango);

router.get('/status', authenticateToken, authorizeRole(['admin']), getAttendanceStatus);
router.get('/check-status-dia', authenticateToken, authorizeRole(['admin', 'profesor']), getCheckStatusDia);

module.exports = router;
