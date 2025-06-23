const sequelize = require('../config/database');

const createRM = async (req, res) => {
  const { id_usuario, id_ejercicio, peso, repeticiones, notas } = req.body;

  if (!id_usuario || !id_ejercicio || peso === undefined || !repeticiones) {
    return res.status(400).json({ 
      error: 'Se requieren id_usuario, id_ejercicio, peso y repeticiones' 
    });
  }

  try {
    await sequelize.query('CALL CreateRM(:id_usuario, :id_ejercicio, :peso, :repeticiones, :notas)', {
      replacements: { 
        id_usuario, 
        id_ejercicio, 
        peso, 
        repeticiones, 
        notas: notas || null 
      }
    });

    res.status(201).json({ 
      success: true,
      message: 'RM registrado correctamente' 
    });
  } catch (error) {
    console.error('Error registrando RM:', error);
    
    if (error.original?.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(409).json({ 
        success: false,
        error: error.original.sqlMessage 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const updateRM = async (req, res) => {
  const { id_usuario, id_ejercicio, repeticiones, nuevo_peso, nuevas_notas } = req.body;

  if (!id_usuario || !id_ejercicio || !repeticiones) {
    return res.status(400).json({ 
      error: 'Se requieren id_usuario, id_ejercicio y repeticiones' 
    });
  }

  if (nuevo_peso === undefined && !nuevas_notas) {
    return res.status(400).json({ 
      error: 'Debe proporcionar al menos un campo para actualizar (nuevo_peso o nuevas_notas)' 
    });
  }

  try {
    await sequelize.query('CALL UpdateRM(:id_usuario, :id_ejercicio, :repeticiones, :nuevo_peso, :nuevas_notas)', {
      replacements: { 
        id_usuario, 
        id_ejercicio, 
        repeticiones,
        nuevo_peso: nuevo_peso || null, 
        nuevas_notas: nuevas_notas || null 
      }
    });

    res.status(200).json({ 
      success: true,
      message: 'RM actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error actualizando RM:', error);
    
    if (error.original?.code === 'ER_SIGNAL_EXCEPTION') {
      return res.status(404).json({ 
        success: false,
        error: error.original.sqlMessage 
      });
    }

    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const getRMsByUser = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: 'Missing user id parameter.' });
  }

  try {
    const results = await sequelize.query('CALL GetRMsUsuario(:id_usuario)', {
      replacements: { id_usuario }
    });

    // Verificar si hay resultados
    if (results.length === 0) {
      return res.status(200).json({ 
        message: 'No hay registros RM para este usuario.',
        data: [] 
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error retrieving user RMs:', error);
    res.status(500).json({ 
      error: error.original?.sqlMessage || 'Internal server error',
      details: error.message 
    });
  }
};




module.exports = {
  createRM,
  getRMsByUser,
  updateRM
};