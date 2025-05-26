const sequelize = require('../config/database');

const getClassesByUser = async (req, res) => {
    const { userId, fecha } = req.query; 

    if (!userId || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros: userId y fecha son obligatorios.' });
    }
    try {
        const results = await sequelize.query('CALL GetClassesByUser(:userId, :fecha)', {
            replacements: { userId, fecha },
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching classes by user plan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



const getAllClasses = async (req, res) => {
    const { fecha } = req.query; 

    if (!fecha) {
        return res.status(400).json({ error: 'Falta el parámetro fecha.' });
    }

    try {
        const results = await sequelize.query('CALL GetAllClasses(:fecha)', {
            replacements: { fecha }
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching all classes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const registerToClass = async (req, res) => {
    const { userId, classId, fecha } = req.body;

    if (!userId || !classId || !fecha) {
  return res.status(400).json({ error: 'Faltan parámetros: userId, classId y fecha son obligatorios.' });
}

    await sequelize.query('CALL RegisterToClass(:userId, :classId, :fecha)', {
        replacements: {
        userId,
        classId,
        fecha
        },
    });
  }

const getUsersByClass = async (req, res) => {
    const { classId, fecha } = req.query;

    if (!classId || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros: classId y fecha son obligatorios.' });
    }

    try {
        // Ajusta la consulta según tu modelo y base de datos
        const results = await sequelize.query(
            'CALL GetUsersByClass(:classId, :fecha)', // Debes tener este SP o consulta
            { replacements: { classId, fecha } }
        );
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
    getUsersByClass,
};
