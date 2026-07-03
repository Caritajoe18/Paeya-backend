import { Sequelize } from 'sequelize';
import config from './index.js';

const sequelize = new Sequelize(config.database.url, {
  dialect: config.database.dialect,
  logging: config.isDev ? console.log : false,
  dialectOptions: {
    ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000,
  },
});

export async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connection established');
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    if (!config.isDev) process.exit(1);
  }
}

export default sequelize;
