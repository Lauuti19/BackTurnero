const sequelize = require('../config/database');

// Get all cash movements
const getAllCashMovements = async (req, res) => {
  try {
    const movements = await sequelize.query('CALL GetAllCashMovements()');
    res.json({ movements });
  } catch (error) {
    console.error('Error getting all cash movements:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get cash movements by date range
const getCashMovementsByDateRange = async (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required parameters: start_date, end_date.' });
  }

  try {
    const movements = await sequelize.query(
      'CALL GetCashMovementsByDateRange(:start_date, :end_date)',
      { replacements: { start_date, end_date } }
    );
    res.json({ movements: Array.isArray(movements) ? movements : [] });
  } catch (error) {
    console.error('Error getting cash movements by date range:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get today's cash movements
const getTodayCashMovements = async (req, res) => {
  try {
    const movements = await sequelize.query('CALL GetTodayCashMovements()');
    res.json({ movements });
  } catch (error) {
    console.error('Error getting today cash movements:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const registerCashMovement = async (req, res) => {
  const { type, payment_method, user_id, concept, details, paid } = req.body;

  if (!type || !payment_method || !user_id || !concept || !details || paid === undefined) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    await sequelize.query(
      'CALL RegisterCajaMovimiento(:type, :payment_method, :user_id, :concept, :details, :paid)',
      {
        replacements: {
          type,
          payment_method,
          user_id,
          concept,
          details: JSON.stringify(details),
          paid
        }
      }
    );

    res.json({ message: 'Cash movement registered successfully.' });
  } catch (error) {
    console.error('Error registering cash movement:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Requiere sequelize ya configurado (como tenés)
const getTodayCashSummary = async (req, res) => {
  try {
    const [summary] = await sequelize.query('CALL GetTodayCashSummary()');
    res.json({ summary });
  } catch (error) {
    console.error('Error getting today summary:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getCashEfectivoDisponible = async (req, res) => {
  try {
    const [row] = await sequelize.query('CALL GetCashEfectivoDisponible()');    const efectivo = row && (row.efectivo_disponible ?? (Array.isArray(row) ? row[0]?.efectivo_disponible : 0));
    res.json({ efectivo: efectivo ?? 0 });
  } catch (error) {
    console.error('Error getting efectivo disponible:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getCashSummaryByPaymentMethod = async (req, res) => {
  try {
    const summary = await sequelize.query('CALL GetCashSummaryByPaymentMethod()');
    res.json({ summary });
  } catch (error) {
    console.error('Error getting summary by payment method:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const registerCashOut = async (req, res) => {
  const { metodo_pago, id_usuario, concepto, monto, pagado } = req.body;

  if (!metodo_pago || !id_usuario || !concepto || !monto) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
  }

  try {
    await sequelize.query(
      'CALL RegisterCashOut(:metodo_pago, :id_usuario, :concepto, :monto, :pagado)',
      {
        replacements: { metodo_pago, id_usuario, concepto, monto, pagado: pagado || 0 }
      }
    );
    res.json({ message: 'Egreso registrado correctamente.' });
  } catch (error) {
    console.error('Error en registrarEgreso:', error);
    res.status(500).json({ error: error.message });
  }
};
const getTotalCashByPeriod = async (req, res) => {
  // aceptar ambas formas
  const { periodo, period } = req.query;
  const targetPeriod = periodo || period;

  if (!targetPeriod) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro 'periodo' (formato YYYY-MM)." });
  }

  try {
    const totals = await sequelize.query(
      'CALL GetTotalCashByPaymentMethodAndPeriod(:p_periodo)',
      {
        replacements: { p_periodo: targetPeriod }
      }
    );

    // el SP devuelve filas agrupadas por método, así que las mandamos tal cual
    res.json({
      periodo: targetPeriod,
      totals: Array.isArray(totals) ? totals : []
    });
  } catch (error) {
    console.error('Error getting total cash by period:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


const getEgresosByPeriod = async (req, res) => {
  const { periodo, period } = req.query;
  const targetPeriod = periodo || period;

  if (!targetPeriod) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro 'periodo' (formato YYYY-MM)." });
  }

  try {
    const egresos = await sequelize.query(
      'CALL GetEgresosByPeriod(:p_periodo)',
      {
        replacements: { p_periodo: targetPeriod }
      }
    );

    res.json({
      periodo: targetPeriod,
      egresos: Array.isArray(egresos) ? egresos : []
    });
  } catch (error) {
    console.error('Error getting egresos by period:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Cerrar la caja mensual
const cerrarCajaMensual = async (req, res) => {
  const { periodo, ahorros = 0, observaciones = null } = req.body;

  if (!periodo) {
    return res
      .status(400)
      .json({ error: "Falta el parámetro 'periodo' (formato YYYY-MM)." });
  }

  try {
    const result = await sequelize.query(
      'CALL CerrarCajaMensual(:p_periodo, :p_ahorros, :p_observaciones)',
      {
        replacements: {
          p_periodo: periodo,
          p_ahorros: ahorros,
          p_observaciones: observaciones
        }
      }
    );

    res.json({
      message: 'Caja cerrada correctamente.',
      result: Array.isArray(result) ? result : []
    });
  } catch (error) {
    console.error('Error closing monthly cash box:', error);
    // si el SP tiró SIGNAL porque las acciones no suman 100
    res.status(500).json({ error: error.message || 'Internal server error.' });
  }
};

const getCajaActiva = async (req, res) => {
  const { periodo } = req.query;

  try {
    // llamamos al SP nuevo, que acepta periodo opcional
    const caja = await sequelize.query(
      "CALL GetCajaActivaActualizada(:p_periodo)",
      {
        replacements: { p_periodo: periodo || null },
      }
    );

    // el SP devuelve un array con una fila o vacío
    return res.json({
      caja: Array.isArray(caja) ? caja : [],
    });
  } catch (error) {
    console.error("Error en getCajaActiva:", error);
    return res.status(500).json({
      error: error.message || "Error interno del servidor.",
    });
  }
};

module.exports = {
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
};

