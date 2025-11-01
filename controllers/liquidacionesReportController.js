// controllers/liquidacionesReportController.js
const sequelize = require('../config/database');

// GET /liquidaciones/cerradas?periodo=2025-10
const getLiquidacionesCerradasByPeriod = async (req, res) => {
  const { periodo } = req.query;
  if (!periodo) {
    return res.status(400).json({ error: 'Falta periodo (YYYY-MM).' });
  }

  try {
    const rows = await sequelize.query(
      'CALL GetLiquidacionesCerradasByPeriod(:periodo)',
      { replacements: { periodo } }
    );
    res.json(rows);
  } catch (err) {
    console.error('Error en GetLiquidacionesCerradasByPeriod:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /liquidaciones/detalle?periodo=2025-10
const getDetalleLiquidacionesByPeriod = async (req, res) => {
  const { periodo } = req.query;
  if (!periodo) {
    return res.status(400).json({ error: 'Falta periodo (YYYY-MM).' });
  }

  try {
    const rows = await sequelize.query(
      'CALL GetDetalleLiquidacionesByPeriod(:periodo)',
      { replacements: { periodo } }
    );
    res.json(rows);
  } catch (err) {
    console.error('Error en GetDetalleLiquidacionesByPeriod:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /liquidaciones/profesor?id_usuario=3&periodo=2025-10
const getLiquidacionesProfesor = async (req, res) => {
  const { id_usuario, periodo } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta id_usuario.' });
  }

  try {
    const rows = await sequelize.query(
      'CALL GetLiquidacionesProfesor(:id_usuario, :periodo)',
      { replacements: { id_usuario, periodo: periodo || null } }
    );
    res.json(rows);
  } catch (err) {
    console.error('Error en GetLiquidacionesProfesor:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /liquidaciones/profesor/resumen?id_usuario=3&periodo=2025-10
const getResumenAsistenciasProfesor = async (req, res) => {
  const { id_usuario, periodo } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta id_usuario.' });
  }

  try {
    const [row] = await sequelize.query(
      'CALL GetResumenAsistenciasProfesor(:id_usuario, :periodo)',
      { replacements: { id_usuario, periodo: periodo || null } }
    );
    res.json(row);
  } catch (err) {
    console.error('Error en GetResumenAsistenciasProfesor:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET /liquidaciones/profesor/historial?id_usuario=3
const getHistorialLiquidaciones = async (req, res) => {
  const { id_usuario } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta id_usuario.' });
  }

  try {
    const rows = await sequelize.query(
      'CALL GetHistorialLiquidacionesProfesor(:id_usuario)',
      { replacements: { id_usuario } }
    );
    res.json(rows);
  } catch (err) {
    console.error('Error en GetHistorialLiquidacionesProfesor:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLiquidacionesCerradasByPeriod,
  getDetalleLiquidacionesByPeriod,
  getLiquidacionesProfesor,
  getResumenAsistenciasProfesor,
  getHistorialLiquidaciones
};
