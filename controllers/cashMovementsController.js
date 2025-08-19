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
    res.json({ movements });
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
  const { type, payment_method, user_id, concept, details } = req.body;

  if (!type || !payment_method || !user_id || !concept || !details) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    await sequelize.query(
      'CALL RegisterCajaMovimiento(:type, :payment_method, :user_id, :concept, :details)',
      { replacements: { type, payment_method, user_id, concept, details: JSON.stringify(details) } }
    );
    res.json({ message: 'Cash movement registered successfully.' });
  } catch (error) {
    console.error('Error registering cash movement:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { registerCashMovement, getAllCashMovements, getCashMovementsByDateRange, getTodayCashMovements };
