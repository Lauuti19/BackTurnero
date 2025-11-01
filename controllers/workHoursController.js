// controllers/workHoursController.js
const sequelize = require('../config/database');

// Crear horas pactadas
const createWorkHours = async (req, res) => {
  const { user_id, work_hours, rate } = req.body;
  try {
    await sequelize.query(
      'CALL CreateWorkHours(:user_id, :work_hours, :rate)',
      { replacements: { user_id, work_hours, rate } }
    );
    res.json({ message: 'Horas pactadas creadas correctamente.' });
  } catch (error) {
    console.error('Error en CreateWorkHours:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener horas pactadas
const getWorkHours = async (req, res) => {
  const { user_id } = req.query;
  try {
    const horas = await sequelize.query(
      'CALL GetWorkHours(:user_id)',
      { replacements: { user_id: user_id || null } }
    );
    res.json({ horas });
  } catch (error) {
    console.error('Error en GetWorkHours:', error);
    res.status(500).json({ error: error.message });
  }
};

// Liquidar profesor (acción)
const liquidarProfesor = async (req, res) => {
  const { id_usuario, periodo, horas_pagadas } = req.body;
  if (!id_usuario || !periodo || horas_pagadas === undefined) {
    return res.status(400).json({ error: 'Faltan parámetros id_usuario, periodo y horas_pagadas.' });
  }

  try {
    await sequelize.query(
      'CALL LiquidarProfesor(:id_usuario, :periodo, :horas_pagadas)',
      { replacements: { id_usuario, periodo, horas_pagadas } }
    );

    res.json({ message: 'Liquidación realizada con éxito' });
  } catch (error) {
    console.error('Error en LiquidarProfesor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Registrar check-in
const registrarCheckIn = async (req, res) => {
  const { id_usuario, fecha, hora } = req.body;
  try {
    await sequelize.query(
      'CALL RegistrarCheckIn(:id_usuario, :fecha, :hora)',
      { replacements: { id_usuario, fecha, hora } }
    );
    res.json({ message: 'Check-in registrado correctamente.' });
  } catch (error) {
    console.error('Error en RegistrarCheckIn:', error);
    res.status(500).json({ error: error.message });
  }
};

// Registrar check-out
const registrarCheckOut = async (req, res) => {
  const { id_usuario, fecha, hora } = req.body;
  try {
    await sequelize.query(
      'CALL RegistrarCheckOut(:id_usuario, :fecha, :hora)',
      { replacements: { id_usuario, fecha, hora } }
    );
    res.json({ message: 'Check-out registrado correctamente.' });
  } catch (error) {
    console.error('Error en RegistrarCheckOut:', error);
    res.status(500).json({ error: error.message });
  }
};

// Delete de horas pactadas
const softDeleteWorkHours = async (req, res) => {
  const { id_pactado } = req.params;
  try {
    await sequelize.query(
      'CALL SoftDeleteWorkHours(:id_pactado)',
      { replacements: { id_pactado } }
    );
    res.json({ message: 'Horas pactadas desactivadas correctamente.' });
  } catch (error) {
    console.error('Error en SoftDeleteWorkHours:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update horas pactadas
const updateWorkHours = async (req, res) => {
  const { id_pactado, work_hours, rate } = req.body;
  try {
    await sequelize.query(
      'CALL UpdateWorkHours(:id_pactado, :work_hours, :rate)',
      { replacements: { id_pactado, work_hours, rate } }
    );
    res.json({ message: 'Horas pactadas actualizadas correctamente.' });
  } catch (error) {
    console.error('Error en UpdateWorkHours:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener horas trabajadas por periodo (YYYY-MM)
const getWorkedHours = async (req, res) => {
  const { id_usuario, periodo } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta id_usuario' });
  }

  try {
    const result = await sequelize.query(
      'CALL GetWorkedHours(:id_usuario, :periodo)',
      { replacements: { id_usuario, periodo: periodo || null } }
    );
    res.json({ horas_trabajadas: result[0]?.horas_trabajadas || 0 });
  } catch (error) {
    console.error('Error en GetWorkedHours:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener horas trabajadas por rango
const getWorkedHoursByRange = async (req, res) => {
  const { id_usuario, desde, hasta } = req.query;
  if (!id_usuario || !desde || !hasta) {
    return res.status(400).json({ error: 'Faltan parámetros id_usuario, desde, hasta' });
  }

  try {
    const result = await sequelize.query(
      'CALL GetWorkedHoursByRange(:id_usuario, :desde, :hasta)',
      { replacements: { id_usuario, desde, hasta } }
    );
    res.json({ horas_trabajadas: result[0]?.horas_trabajadas || 0 });
  } catch (error) {
    console.error('Error en GetWorkedHoursByRange:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar asistencias de profesores
const getAsistenciasProfes = async (req, res) => {
  const { desde, hasta, periodo } = req.query;

  if ((!desde || !hasta) && !periodo) {
    return res.status(400).json({ error: 'Debes enviar rango (desde & hasta) o un periodo (YYYY-MM).' });
  }

  try {
    const asistencias = await sequelize.query(
      'CALL GetAsistenciasProfes(:desde, :hasta, :periodo)',
      { replacements: { desde: desde || null, hasta: hasta || null, periodo: periodo || null } }
    );
    res.json({ asistencias });
  } catch (error) {
    console.error('Error en GetAsistenciasProfes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Horas trabajadas por profesor
const getHorasTrabajadasProfes = async (req, res) => {
  const { desde, hasta, periodo } = req.query;

  if ((!desde || !hasta) && !periodo) {
    return res.status(400).json({ error: 'Debes enviar rango (desde & hasta) o un periodo (YYYY-MM).' });
  }

  try {
    const horas = await sequelize.query(
      'CALL GetHorasTrabajadasProfes(:desde, :hasta, :periodo)',
      { replacements: { desde: desde || null, hasta: hasta || null, periodo: periodo || null } }
    );
    res.json({ horas });
  } catch (error) {
    console.error('Error en GetHorasTrabajadasProfes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Pre-liquidación (ya estaba)
const getPreLiquidacionProfesor = async (req, res) => {
  const { id_usuario, periodo } = req.query;
  if (!id_usuario || !periodo) {
    return res.status(400).json({ error: 'Faltan parámetros id_usuario y periodo (YYYY-MM).' });
  }

  try {
    const [result] = await sequelize.query(
      'CALL GetPreLiquidacionProfesor(:id_usuario, :periodo)',
      { replacements: { id_usuario, periodo } }
    );
    res.json(result);
  } catch (error) {
    console.error('Error en GetPreLiquidacionProfesor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener liquidaciones por rango
const getLiquidacionesPorRango = async (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Faltan parámetros desde y hasta' });
  }

  try {
    const liquidaciones = await sequelize.query(
      'CALL ObtenerLiquidacionesPorRango(:desde, :hasta)',
      { replacements: { desde, hasta } }
    );
    res.json({ liquidaciones });
  } catch (error) {
    console.error('Error en ObtenerLiquidacionesPorRango:', error);
    res.status(500).json({ error: error.message });
  }
};

// Estado de asistencia
const getAttendanceStatus = async (req, res) => {
  const { id_usuario, fecha } = req.query;
  if (!id_usuario || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros id_usuario y fecha (YYYY-MM-DD).' });
  }

  try {
    const [rows] = await sequelize.query(
      'CALL GetAttendanceStatus(:id_usuario, :fecha)',
      { replacements: { id_usuario, fecha } }
    );
    return res.json(rows || { status: 'none' });
  } catch (error) {
    console.error('Error en GetAttendanceStatus:', error);
    return res.status(500).json({ error: error.message });
  }
};

// check del día
const getCheckStatusDia = async (req, res) => {
  const { id_usuario, fecha } = req.query;
  if (!id_usuario || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros id_usuario y fecha (YYYY-MM-DD).' });
  }

  try {
    const [result] = await sequelize.query(
      'CALL GetCheckStatusDia(:id_usuario, :fecha)',
      { replacements: { id_usuario, fecha } }
    );
    return res.json(result);
  } catch (error) {
    console.error('Error en GetCheckStatusDia:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
