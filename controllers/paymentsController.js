const sequelize = require('../config/database');

// Obtener cuotas activas de un usuario
const getActiveFees = async (req, res) => {
  const { id_usuario } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta el parámetro id_usuario.' });
  }

  try {
    const cuotas = await sequelize.query(
      'CALL GetActiveFees(:id_usuario, CURDATE())',
      { replacements: { id_usuario } }
    );
    res.json({ cuotas });
  } catch (error) {
    console.error('Error al obtener cuotas activas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Registrar nueva cuota (usa info del plan automáticamente)
const registerFee = async (req, res) => {
  const { id_usuario, id_plan, metodo_pago, pagado } = req.body;

  if (!id_usuario || !id_plan || !metodo_pago || pagado == null) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL RegisterFee(:id_usuario, :id_plan, :metodo_pago, :pagado)',
      { replacements: { id_usuario, id_plan, metodo_pago, pagado } }
    );
    res.json({ message: 'Cuota registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Pagar cuota existente (cuando estaba en estado Pendiente)
const payFee = async (req, res) => {
  const { id_cuota, metodo_pago } = req.body;

  if (!id_cuota || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL PayFee(:id_cuota, :metodo_pago)',
      { replacements: { id_cuota, metodo_pago } }
    );
    res.json({ message: 'Cuota pagada correctamente.' });
  } catch (error) {
    console.error('Error al pagar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getActiveFees, registerFee, payFee };
