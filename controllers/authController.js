const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const registerClient = async (req, res) => {
  const { email, password, nombre, dni, celular } = req.body;

  try {
    // Verificar si el email ya existe usando el SP GetUserByEmail
    const [user] = await sequelize.query('CALL GetUserByEmail(:email)', {
      replacements: { email },
    });

    if (user) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Llamar al SP RegisterClient
    await sequelize.query('CALL RegisterClient(:email, :password, :nombre, :dni, :celular)', {
      replacements: {
        email,
        password: hashedPassword,
        nombre,
        dni,
        celular,
      },
    });

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

module.exports = {
  registerClient,
};
