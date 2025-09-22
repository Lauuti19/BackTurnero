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



module.exports = {
  registerCashMovement,
  getAllCashMovements,
  getCashMovementsByDateRange,
  getTodayCashMovements,
  getTodayCashSummary,
  getCashEfectivoDisponible,
  getCashSummaryByPaymentMethod,
  registerCashOut
};

