const sequelize = require('../config/database');

const getDisciplinas = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GetDisciplinas()');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener disciplinas:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Error interno del servidor' });
  }
};

const deleteDiscipline = async (req, res) => {
  const { disciplineId } = req.body;

  if (!disciplineId) {
    return res.status(400).json({ error: 'Missing disciplineId parameter.' });
  }

  try {
    await sequelize.query('CALL DeleteDisciplina(:disciplineId)', {
      replacements: { disciplineId }
    });

    res.status(200).json({ message: 'Discipline logically deleted.' });
  } catch (error) {
    console.error('Error logically deleting discipline:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const createDiscipline = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing name parameter.' });
  }

  try {
    await sequelize.query('CALL CreateDiscipline(:name)', {
      replacements: { name }
    });

    res.status(201).json({ message: 'Discipline created successfully.' });
  } catch (error) {
    console.error('Error creating discipline:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

module.exports = {
    getDisciplinas,
    deleteDiscipline, 
    createDiscipline
}