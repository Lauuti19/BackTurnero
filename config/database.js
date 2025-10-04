const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    },
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Conectado correctamente a la base de datos en AlwaysData'))
  .catch(err => console.error('❌ Error de conexión a la base:', err));

module.exports = sequelize;
