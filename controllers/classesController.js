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

  try {
    await sequelize.query('CALL RegisterToClass(:userId, :classId, :fecha)', {
      replacements: { userId, classId, fecha },
    });

    
    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error al registrar usuario en la clase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const getUsersByClassAndDate = async (req, res) => {
    const { classId, fecha } = req.query;

    if (!classId || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros: classId y fecha son obligatorios.' });
    }

    try {
        const results = await sequelize.query('CALL GetUsersByClassAndDate(:classId, :fecha)', {
            replacements: { classId, fecha }
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching users by class and date:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const unregisterFromClass = async (req, res) => {
  const { userId, classId, fecha } = req.body;

  if (!userId || !classId || !fecha) {
    return res.status(400).json({ error: 'Faltan parámetros: userId, classId y fecha son obligatorios.' });
  }

  try {
    await sequelize.query('CALL UnregisterFromClass(:userId, :classId, :fecha)', {
      replacements: { userId, classId, fecha },
    });

    res.status(200).json({ message: 'Usuario desinscrito correctamente de la clase.' });
  } catch (error) {
    console.error('Error al desinscribir usuario de la clase:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Error interno del servidor' });
  }
};

const createClass = async (req, res) => {
  const { id_disciplina, id_dia, hora, capacidad_max } = req.body;

  if (!id_disciplina || !id_dia || !hora || !capacidad_max) {
    return res.status(400).json({ error: 'Faltan parámetros: id_disciplina, id_dia, hora y capacidad_max son obligatorios.' });
  }

  try {
    await sequelize.query('CALL CreateClass(:id_disciplina, :id_dia, :hora, :capacidad_max)', {
      replacements: { id_disciplina, id_dia, hora, capacidad_max },
    });

    res.status(201).json({ message: 'Clase creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Error interno del servidor' });
  }
};

const getClassesByDay = async (req, res) => {
  const { id_dia } = req.query;

  if (!id_dia) {
    return res.status(400).json({ error: 'Falta el parámetro id_dia.' });
  }

  try {
    const results = await sequelize.query('CALL GetClassesByDay(:id_dia)', {
      replacements: { id_dia }
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Error al obtener clases por día:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Error interno del servidor' });
  }
};
const getClassesByUserNoCredits = async (req, res) => {
    const { userId, fecha } = req.query; 

    if (!userId || !fecha) {
        return res.status(400).json({ error: 'Faltan parámetros: userId y fecha son obligatorios.' });
    }

    try {
        const results = await sequelize.query('CALL GetClassesByUserNoCredits(:userId, :fecha)', {
            replacements: { userId, fecha },
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error fetching classes by user plan (no credits):', error);
        res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
    }
};
const updateClass = async (req, res) => {
  const { id_clase, id_disciplina, id_dia, hora, capacidad_max } = req.body;

  if (!id_clase) {
    return res.status(400).json({ error: 'El parámetro id_clase es obligatorio.' });
  }

  try {
    await sequelize.query(
      'CALL UpdateClasses(:id_clase, :id_disciplina, :id_dia, :hora, :capacidad_max)',
      {
        replacements: {
          id_clase,
          id_disciplina: id_disciplina ?? null,
          id_dia: id_dia ?? null,
          hora: hora ?? null,
          capacidad_max: capacidad_max ?? null
        }
      }
    );

    res.status(200).json({ message: 'Clase actualizada correctamente.' });
  } catch (error) {
    console.error('Error al modificar clase:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Error interno del servidor' });
  }
};

const deleteClass = async (req, res) => {
  const { classId } = req.body;

  if (!classId) {
    return res.status(400).json({ error: 'Missing classId parameter.' });
  }

  try {
    await sequelize.query('CALL DeleteClass(:classId)', {
      replacements: { classId }
    });

    res.status(200).json({ message: 'Class logically deleted.' });
  } catch (error) {
    console.error('Error logically deleting class:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};
const updateAttendance = async (req, res) => {
  const { id_clase, fecha, asistencias } = req.body;

  if (!id_clase || !fecha || !asistencias) {
    return res.status(400).json({
      error: 'Faltan parámetros: id_clase, fecha y asistencias son obligatorios.',
    });
  }

  try {
    const asistenciasJson =
      typeof asistencias === 'string' ? asistencias : JSON.stringify(asistencias);

    await sequelize.query(
      'CALL ActualizarAsistenciaClase(:id_clase, :fecha, :asistencias)',
      {
        replacements: { id_clase, fecha, asistencias: asistenciasJson },
      }
    );

    res.status(200).json({ message: 'Asistencia actualizada correctamente.' });
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    res.status(500).json({
      error: error.original?.sqlMessage || 'Error interno del servidor',
    });
  }
};

const checkAttendanceQR = async (req, res) => {
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta el parámetro id_usuario.' });
  }

  try {
    const [result] = await sequelize.query(
      'CALL GetTodayClassByUser(:id_usuario)',
      { replacements: { id_usuario } }
    );

    if (!result || result.length === 0) {
      return res.status(200).json({
        tieneClaseHoy: false,
        message: 'El usuario no tiene clases registradas hoy.',
      });
    }

    const clase = result[0];
    const yaPresente = clase.presente === 1;

    res.status(200).json({
      tieneClaseHoy: true,
      yaPresente,
      clase: {
        id_clase: clase.id_clase,
        disciplina: clase.disciplina,
        hora: clase.hora,
      },
      message: yaPresente
        ? 'El usuario ya marcó asistencia en esta clase.'
        : 'Clase disponible para marcar asistencia.',
    });
  } catch (error) {
    console.error('Error al verificar asistencia QR:', error);
    res.status(500).json({
      error: error.original?.sqlMessage || 'Error interno del servidor',
    });
  }
};
const registerIndividualAttendance = async (req, res) => {
  const { classId, userId, date } = req.body;

  if (!classId || !userId || !date) {
    return res.status(400).json({
      error: 'Missing parameters: classId, userId, and date are required.'
    });
  }

  try {
    await sequelize.query('CALL RegisterIndividualAttendance(:classId, :userId, :date)', {
      replacements: { classId, userId, date },
    });

    res.status(200).json({ message: 'Attendance successfully registered.' });
  } catch (error) {
    console.error('Error registering individual attendance:', error);
    res.status(500).json({
      error: error.original?.sqlMessage || 'Internal server error'
    });
  }
};



module.exports = {
    getClassesByUser,
    getAllClasses,
    registerToClass,
    getUsersByClassAndDate,
    getClassesByUserNoCredits,
    unregisterFromClass,
    createClass,
    getClassesByDay,
    updateClass, 
    deleteClass,
    updateAttendance,
    checkAttendanceQR,
    registerIndividualAttendance
};