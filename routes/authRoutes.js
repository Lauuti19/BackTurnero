const express = require('express');
const router = express.Router();
const { registerClient, login,registerUser } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authenticateToken');


router.post('/register', registerClient);
router.post('/register-user', registerUser);




router.post('/login', login);
router.get('/perfil', authenticateToken, (req, res) => {
    const { id_usuario, email, id_rol, nombre, id_estado } = req.user;

    res.json({
        message: 'Perfil del usuario',
        usuario: {
            id: id_usuario, // <-- agrega este campo
            email,
            nombre,
            id_rol,
            id_estado,
        }
    });
});

module.exports = router;