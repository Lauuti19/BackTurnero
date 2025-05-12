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

module.exports = {
    getClassesByUser,
    getAllClasses,
};

