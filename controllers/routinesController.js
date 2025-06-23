const sequelize = require('../config/database');

const createUserRoutineWithExercises = async (req, res) => {
  const { userId, routineName, exercises } = req.body;

  if (!userId || !routineName || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid input data.' });
  }

  const exercisesString = exercises.map(e =>
    `${e.id_ejercicio},${e.dia},${e.orden},${e.rondas},${e.repeticiones}`
  ).join(';');

  try {
    await sequelize.query('CALL CreateUserRoutineWithExercises(:userId, :routineName, :exercises)', {
      replacements: {
        userId,
        routineName,
        exercises: exercisesString
      }
    });

    res.status(201).json({ message: 'Routine created successfully.' });
  } catch (error) {
    console.error('Error creating routine:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const getRoutinesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await sequelize.query('CALL GetRoutinesByUser(:userId)', {
      replacements: { userId }
    });
    res.status(200).json(results);
  } catch (error) {
    console.error('Error getting routines by user:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};
const getRoutinesByUserName = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Missing name query parameter.' });
  }

  try {
    const results = await sequelize.query('CALL GetRoutinesByUserName(:name)', {
      replacements: { name }
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error getting routines by user name:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const updateUserRoutine = async (req, res) => {
  const { id_rutina, routineName, exercises } = req.body;

  if (!id_rutina) {
    return res.status(400).json({ error: 'Missing id_rutina.' });
  }

  let exercisesString = null;

  if (Array.isArray(exercises) && exercises.length > 0) {
    exercisesString = exercises.map(e =>
      `${e.id_ejercicio},${e.dia},${e.orden},${e.rondas},${e.repeticiones}`
    ).join(';');
  }

  try {
    await sequelize.query('CALL UpdateUserRoutine(:id_rutina, :routineName, :exercises)', {
      replacements: {
        id_rutina,
        routineName: routineName ?? null,
        exercises: exercisesString
      }
    });

    res.status(200).json({ message: 'Routine updated successfully.' });
  } catch (error) {
    console.error('Error updating routine:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};


const deleteUserRoutine = async (req, res) => {
  const { id_rutina } = req.body;

  if (!id_rutina) {
    return res.status(400).json({ error: 'Missing id_rutina in request.' });
  }

  try {
    await sequelize.query('CALL DeleteUserRoutine(:id_rutina)', {
      replacements: { id_rutina }
    });

    res.status(200).json({ message: 'Routine deleted (soft) successfully.' });
  } catch (error) {
    console.error('Error deleting routine:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};


module.exports = {
    createUserRoutineWithExercises, getRoutinesByUser, getRoutinesByUserName, updateUserRoutine,deleteUserRoutine
}
