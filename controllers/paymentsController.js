const sequelize = require('../config/database');

const getInfoCuotas = async (req, res) => {
  const { id_usuario } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta el parámetro id_usuario.' });
  }
  try {
    const cuotas = await sequelize.query(
      'CALL GetInfoCuotas(:id_usuario)',
      { replacements: { id_usuario } }
    );
    res.json({ cuotas });
  } catch (error) {
    console.error('Error al obtener info de cuotas:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const registrarCuota = async (req, res) => {
  const {
    id_usuario,
    id_plan,
    fecha_pago,
    fecha_vencimiento,
    estado_pago,
    creditos_total,
    creditos_disponibles
  } = req.body;

  if (
    !id_usuario || !id_plan || !fecha_pago || !fecha_vencimiento ||
    !estado_pago || creditos_total == null || creditos_disponibles == null
  ) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL RegistrarCuota(:id_usuario, :id_plan, :fecha_pago, :fecha_vencimiento, :estado_pago, :creditos_total, :creditos_disponibles)',
      {
        replacements: {
          id_usuario,
          id_plan,
          fecha_pago,
          fecha_vencimiento,
          estado_pago,
          creditos_total,
          creditos_disponibles
        }
      }
    );
    res.json({ message: 'Cuota registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const registrarCuotaPorNombre = async (req, res) => {
  const { nombre_usuario, id_plan, fecha_pago } = req.body;

  if (!nombre_usuario || !id_plan || !fecha_pago) {
    return res.status(400).json({ error: 'Faltan parámetros obligatorios.' });
  }

  try {
    await sequelize.query(
      'CALL RegistrarCuotaPorNombre(:nombre_usuario, :id_plan, :fecha_pago)',
      {
        replacements: {
          nombre_usuario,
          id_plan,
          fecha_pago
        }
      }
    );
    res.json({ message: 'Cuota registrada correctamente.' });
  } catch (error) {
    console.error('Error al registrar cuota:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getInfoCuotas, registrarCuota, registrarCuotaPorNombre };