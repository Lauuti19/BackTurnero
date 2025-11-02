// controllers/deudasController.js
const sequelize = require('../config/database');

// GET /api/deudas/all
const getAllDeudas = async (req, res) => {
  try {
    const rows = await sequelize.query("CALL GetAllDeudas();");
    const deudas = Array.isArray(rows) ? rows : rows ? [rows] : [];
    return res.status(200).json({ deudas });
  } catch (error) {
    console.error("Error en getAllDeudas:", error);
    return res.status(500).json({ error: "Error al obtener las deudas." });
  }
};

// GET /api/deudas/:id_usuario
const getDeudasUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el parámetro id_usuario." });
  }

  try {
    const rows = await sequelize.query("CALL GetDeudasUsuario(:p_id_usuario);", {
      replacements: { p_id_usuario: id_usuario },
    });

    const deudas = Array.isArray(rows) ? rows : rows ? [rows] : [];
    return res.status(200).json({ id_usuario: Number(id_usuario), deudas });
  } catch (error) {
    console.error("Error en getDeudasUsuario:", error);
    return res.status(500).json({ error: "Error al obtener las deudas del usuario." });
  }
};

const getResumenDeudasUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el parámetro id_usuario." });
  }

  try {
    const rows = await sequelize.query("CALL GetResumenDeudasUsuario(:p_id_usuario);", {
      replacements: { p_id_usuario: id_usuario },
    });

    const resumen = Array.isArray(rows) ? rows[0] : rows;

    return res.status(200).json({
      id_usuario: Number(id_usuario),
      resumen: resumen || {
        total_deudas: 0,
        monto_total_deuda: 0,
        deudas_vencidas: 0,
        monto_vencido: 0,
        proximo_vencimiento: null,
        ultimo_vencimiento: null,
      },
    });
  } catch (error) {
    console.error("Error en getResumenDeudasUsuario:", error);
    return res.status(500).json({ error: "Error al obtener el resumen de deudas del usuario." });
  }
};

const getMisMovimientos = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario; // viene del token
    const meses = req.query.meses ? Number(req.query.meses) : 12;

    const rows = await sequelize.query(
      "CALL GetHistorialPagosUsuario(:id, :meses)",
      {
        replacements: { id: id_usuario, meses },
      }
    );
    res.json({ movimientos: rows || [] });
  } catch (error) {
    console.error("Error getMisMovimientos:", error);
    res.status(500).json({ error: "Error al obtener movimientos" });
  }
};

module.exports = {
  getAllDeudas,
  getDeudasUsuario,
  getResumenDeudasUsuario,
  getMisMovimientos,
};
