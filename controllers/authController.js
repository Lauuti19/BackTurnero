const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

const registerClient = async (req, res) => {
  const { email, password, nombre, dni, celular } = req.body;

  try {
    const [user] = await sequelize.query('CALL GetUserByEmail(:email)', {
      replacements: { email },
    });

    if (user) {
      return res.status(400).json({ message: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

const registerUser = async (req, res) => {
    const { email, password, nombre, dni, celular, id_rol } = req.body;

    try {
        const [user] = await sequelize.query('CALL GetUserByEmail(:email)', {
        replacements: { email },
        });

        if (user) {
        return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await sequelize.query('CALL RegisterUser(:email, :password, :nombre, :dni, :celular, :id_rol)', {
        replacements: {
            email,
            password: hashedPassword,
            nombre,
            dni,
            celular,
            id_rol,
        },
        });

        res.status(201).json({ message: 'Usuario registrado con éxito.' });
    } catch (error) {
        console.error('Error en registro de usuario:', error);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
    };

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await sequelize.query('CALL GetUserByEmail(:email)', {
        replacements: { email },
        });  
        if (!user) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return res.status(400).json({ message: 'Email o contraseña incorrectos.' });
        }


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
          }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al hacer login.' });
    }
    };

module.exports = {
    registerClient,
    registerUser,
    login
};