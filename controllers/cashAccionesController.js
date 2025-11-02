// controllers/cashAccionesController.js
const sequelize = require('../config/database');


const upsertAccionUsuario = async (req, res) => {
  const { id_usuario, porcentaje, fecha_inicio } = req.body;

  if (!id_usuario || !porcentaje || !fecha_inicio) {
    return res.status(400).json({
      error: "Faltan parámetros: id_usuario, porcentaje, fecha_inicio."
    });
  }

  try {
    const result = await sequelize.query(
      'CALL UpsertAccionUsuario(:p_id_usuario, :p_porcentaje, :p_fecha_inicio)',
      {
        replacements: {
          p_id_usuario: id_usuario,
          p_porcentaje: porcentaje,
          p_fecha_inicio: fecha_inicio
        }
      }
    );

    res.json({
      message: result?.[0]?.mensaje || 'Acción actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error en UpsertAccionUsuario:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};


const desactivarAccionUsuario = async (req, res) => {
  const { id_usuario, fecha_fin } = req.body;

  if (!id_usuario || !fecha_fin) {
    return res.status(400).json({
      error: "Faltan parámetros: id_usuario, fecha_fin."
    });
  }

  try {
    const result = await sequelize.query(
      'CALL DesactivarAccionUsuario(:p_id_usuario, :p_fecha_fin)',
      {
        replacements: {
          p_id_usuario: id_usuario,
          p_fecha_fin: fecha_fin
        }
      }
    );

    res.json({
      message: result?.[0]?.mensaje || 'Acción desactivada exitosamente'
    });
  } catch (error) {
    console.error('Error en DesactivarAccionUsuario:', error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};


const getAccionesActivas = async (req, res) => {
  try {
    const acciones = await sequelize.query('CALL GetAccionesActivas()');
    res.json({
      acciones: Array.isArray(acciones) ? acciones : []
    });
  } catch (error) {
    console.error('Error en GetAccionesActivas:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getDistribucionGananciasByCaja = async (req, res) => {
  const { id_caja } = req.query;

  if (!id_caja) {
    return res.status(400).json({ error: "Falta el parámetro 'id_caja'." });
  }

  try {
    const distribucion = await sequelize.query(
      'CALL GetDistribucionGananciasByCaja(:p_id_caja)',
      {
        replacements: { p_id_caja: id_caja }
      }
    );

    res.json({
      id_caja,
      distribucion: Array.isArray(distribucion) ? distribucion : []
    });
  } catch (error) {
    console.error('Error en GetDistribucionGananciasByCaja:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getAllCajasMensuales = async (req, res) => {
  try {
    const cajas = await sequelize.query("CALL GetAllCajasMensuales()");

    return res.json({
      cajas: Array.isArray(cajas) ? cajas : [],
    });
  } catch (error) {
    console.error("Error en getAllCajasMensuales:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error." });
  }
};
const getCajasMensuales = async (req, res) => {
  const { desde = null, hasta = null, solo_activas = 0 } = req.query;

  try {
    const cajas = await sequelize.query(
      "CALL GetCajasMensuales(:p_desde, :p_hasta, :p_solo_activas)",
      {
        replacements: {
          p_desde: desde || null,
          p_hasta: hasta || null,
          // lo pasamos a número por las dudas
          p_solo_activas: Number(solo_activas) || 0,
        },
      }
    );

    return res.json({
      filtros: { desde, hasta, solo_activas: Number(solo_activas) || 0 },
      cajas: Array.isArray(cajas) ? cajas : [],
    });
  } catch (error) {
    console.error("Error en getCajasMensuales:", error);
    return res
      .status(500)
      .json({ error: error.message || "Internal server error." });
  }
};

module.exports = {
    upsertAccionUsuario,
    desactivarAccionUsuario,
    getAccionesActivas,
    getDistribucionGananciasByCaja,
    getAllCajasMensuales,
    getCajasMensuales,
    };
