const sequelize = require('../config/database');

const getPlanes = async (req, res) => {
  try {
    const planes = await sequelize.query('CALL GetPlanes()');
    res.json({ planes });
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { getPlanes };