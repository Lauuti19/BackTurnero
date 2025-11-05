const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

// Validador de contraseña
// - mínimo 8 caracteres
// - al menos 1 minúscula, 1 mayúscula, 1 número y 1 símbolo
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  return regex.test(password);
};

// Helper para hashear siempre igual
const hashPassword = async (password) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

const registerClient = async (req, res) => {
  const { email, password, nombre, dni, celular } = req.body;

  try {
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, un número y un símbolo.',
      });
    }

    // 2) Verificar que el email no esté registrado
    const [existingUser] = await sequelize.query('CALL GetUserByEmail(:email)', {
      replacements: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // 3) Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // 4) Registrar usuario
    await sequelize.query(
      'CALL RegisterClient(:email, :password, :nombre, :dni, :celular)',
      {
        replacements: {
          email,
          password: hashedPassword,
          nombre,
          dni,
          celular,
        },
      }
    );

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
    console.log('Datos recibidos en registerClient:', req.body);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

const registerUser = async (req, res) => {
  const { email, password, nombre, dni, celular, id_rol } = req.body;

  try {
    // 1) Validar fortaleza de la contraseña
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, un número y un símbolo.',
      });
    }

    // 2) Verificar que el email no esté registrado
    const [existingUser] = await sequelize.query('CALL GetUserByEmail(:email)', {
      replacements: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    // 3) Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // 4) Registrar usuario
    await sequelize.query(
      'CALL RegisterUser(:email, :password, :nombre, :dni, :celular, :id_rol)',
      {
        replacements: {
          email,
          password: hashedPassword,
          nombre,
          dni,
          celular,
          id_rol,
        },
      }
    );

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error en registro de usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [user] = await sequelize.query('CALL GetUserByEmail(:email)', {
      replacements: { email },
    });

    // No revelar si el error es por email o password
    if (!user) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos.' });
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Email o contraseña incorrectos.' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        email: user.email,
        id_rol: user.id_rol,
        nombre: user.nombre,
        id_estado: user.id_estado,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      usuario: {
        id_usuario: user.id_usuario,
        email: user.email,
        id_rol: user.id_rol,
        nombre: user.nombre,
        id_estado: user.id_estado,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al hacer login.' });
  }
};

const updatePassword = async (req, res) => {
  const { id_usuario, nuevaPassword } = req.body;
  // Ideal: sacar id_usuario del token (req.user.id_usuario) y NO del body,
  // pero acá te lo dejo igual que tu firma original.

  try {
    if (!isStrongPassword(nuevaPassword)) {
      return res.status(400).json({
        message:
          'La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, un número y un símbolo.',
      });
    }

    const hashedPassword = await hashPassword(nuevaPassword);

    await sequelize.query('CALL UpdatePassword(:id_usuario, :p_password_hash)', {
      replacements: {
        id_usuario,
        p_password_hash: hashedPassword,
      },
    });

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña.' });
  }
};

module.exports = {
  registerClient,
  registerUser,
  login,
  updatePassword,
};
