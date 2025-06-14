const sequelize = require('../config/database');

const buscarUsuariosPorNombre = async (req, res) => {
  const { nombre } = req.query;
  try {
    const usuarios = await sequelize.query('CALL BuscarUsuariosPorNombre(:nombre)', {
      replacements: { nombre }
    });
    console.log('Usuarios encontrados:', usuarios);
    res.json(usuarios);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const getUserFullInfo = async (req, res) => {
  const { id_usuario } = req.params;

  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta el parámetro id_usuario.' });
  }

  try {
    const [results] = await sequelize.query('CALL GetUserFullInfo(:id_usuario)', {
      replacements: { id_usuario }
    });

    if (!results) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const {
      id_usuario: id,
      email,
      rol,
      dni,
      celular,
      nombre_plan,
      fecha_pago,
      fecha_vencimiento,
      estado_pago,
      creditos_total,
      creditos_disponibles
    } = results;

    const response = {
      datos_usuario: { id_usuario: id, email, rol, dni, celular },
      cuota: nombre_plan ? {
        nombre_plan,
        fecha_pago,
        fecha_vencimiento,
        estado_pago,
        creditos_total,
        creditos_disponibles
      } : null
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

const updateUserInfo = async (req, res) => {
  const { id_usuario, nombre, email, dni, celular } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'El campo id_usuario es obligatorio.' });
  }

  try {
    await sequelize.query(
      'CALL UpdateUserInfo(:id_usuario, :nombre, :email, :dni, :celular)',
      {
        replacements: {
          id_usuario,
          nombre: nombre || null,
          email: email || null,
          dni: dni || null,
          celular: celular || null
        }
      }
    );

    res.status(200).json({ mensaje: 'Datos del usuario actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};




module.exports = { buscarUsuariosPorNombre, getUserFullInfo, updateUserInfo };