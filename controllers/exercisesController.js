const sequelize = require('../config/database');

const getAllExercises = async (req, res) => {
  try {
    const results = await sequelize.query('CALL GetAllExercises()');
    res.status(200).json(results);
  } catch (error) {
    console.error('Error retrieving exercises:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const searchExercisesByName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing name parameter in query string.' });
  }

  try {
    const results = await sequelize.query('CALL SearchExercisesByName(:name)', {
      replacements: { name }
    });
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching exercises:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const createExercise = async (req, res) => {
  const { name, link } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Missing name parameter.' });
  }

  try {
    await sequelize.query('CALL CreateExercise(:name, :link)', {
      replacements: { name, link }
    });

    res.status(201).json({ message: 'Exercise created successfully.' });
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const updateExercise = async (req, res) => {
  const { id, name, link } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing exercise id.' });
  }

  try {
    await sequelize.query('CALL UpdateExercise(:id, :name, :link)', {
      replacements: { id, name, link }
    });

    res.status(200).json({ message: 'Exercise updated successfully.' });
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const deleteExercise = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing exercise id.' });
  }

  try {
    await sequelize.query('CALL DeleteExercise(:id)', {
      replacements: { id }
    });

    res.status(200).json({ message: 'Exercise logically deleted.' });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};
module.exports = {
  getAllExercises,
  searchExercisesByName,
  createExercise, 
  updateExercise,
  deleteExercise
};
