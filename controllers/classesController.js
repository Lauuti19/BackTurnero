const sequelize = require('../config/database');

const getClassesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
    const results = await sequelize.query('CALL GetClassesByUser(:userId)', {
        replacements: { userId },
    });

    res.status(200).json(results);
    } catch (error) {
    console.error('Error fetching classes by user plan:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllClasses = async (req, res) => {
    try {
    const results = await sequelize.query('CALL GetAllClasses()');
    res.status(200).json(results);
    } catch (error) {
    console.error('Error fetching all classes:', error);
    res.status(500).json({ error: 'Internal server error' });
    }
};

const registerToClass = async (req, res) => {
    const { userId, classId } = req.body;

    try {
    await sequelize.query('CALL RegisterToClass(:userId, :classId)', {
        replacements: {
        userId,
        classId,
        },
    });

    res.status(200).json({ message: 'User successfully registered to class.' });
    } catch (error) {
    console.error('Error registering to class:', error);
    res.status(400).json({ error: error.message });
    }
};

const getUsersByClass = async (req, res) => {
  const { classId } = req.params;

  try {
    const results = await sequelize.query('CALL GetUsersByClass(:classId)', {
      replacements: { classId },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching users by class:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    getClassesByUser,
    getAllClasses,
    registerToClass,
    getUsersByClass
};
