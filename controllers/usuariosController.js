const sequelize = require('../config/database');

const buscarUsuariosPorNombre = async (req, res) => {
  const { nombre } = req.query;
  try {
    const usuarios = await sequelize.query('CALL BuscarUsuariosPorNombre(:nombre)', {
      replacements: { nombre }
    });
    console.log('Usuarios encontrados:', usuarios); // <-- Agrega esto
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { buscarUsuariosPorNombre };