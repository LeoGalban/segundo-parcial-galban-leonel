import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
process.env.DB_NAME,
process.env.DB_USER,
process.env.DB_PASSWORD,
{
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306
}
);

export const initDB = async () => {
try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida.');
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};

export default sequelize;