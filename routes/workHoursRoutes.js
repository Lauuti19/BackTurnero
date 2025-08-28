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
  getLiquidacionesPorRango
} = require('../controllers/workHoursController');

router.post('/create', createWorkHours);
router.get('/list', getWorkHours);
router.post('/liquidar', liquidarProfesor);
router.post('/checkin', registrarCheckIn);
router.post('/checkout', registrarCheckOut);
router.delete('/delete/:id_pactado', softDeleteWorkHours);
router.put('/update', updateWorkHours);
router.get('/worked-hours', getWorkedHours);             
router.get('/worked-hours-range', getWorkedHoursByRange); 
router.get('/asistencias', getAsistenciasProfes);         
router.get('/horas-profes', getHorasTrabajadasProfes);
router.get('/pre-liquidacion', getPreLiquidacionProfesor);
router.get('/liquidaciones', getLiquidacionesPorRango); 

module.exports = router;
