const express = require('express');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const classesRoutes = require('./routes/classes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const planesRoutes = require('./routes/planesRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const disciplinasRoutes = require('./routes/disciplinasRoutes');
const exercisesRoutes = require('./routes/exercisesRoutes');
const routinesRoutes = require('./routes/routinesRoutes');
const rmRoutes = require('./routes/rmRoutes');
const productsRoutes = require('./routes/productsRoutes')
const cashMovementsRoutes = require('./routes/cashMovementsRoutes')
const workHoursRoutes = require('./routes/workHoursRoutes')

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS','PUT'],
    credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});


app.use('/api/auth', authRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/routines', routinesRoutes);
app.use('/api/rm', rmRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cash-movements', cashMovementsRoutes);
app.use('/api/workhours', workHoursRoutes);


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