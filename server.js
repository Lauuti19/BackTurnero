const express = require('express');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');


const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/auth', authRoutes);

sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT,'0.0.0.0', () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });