import { Sequelize } from 'sequelize';
import { config } from '../../../config/config.js';

let sequelize;

// Initialize Sequelize based on environment
if (config.nodeEnv === 'production') {
  // PostgreSQL for production
  sequelize = new Sequelize(config.database.url, {
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // SQLite for development/test
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.database.storage || './database.sqlite',
    logging: false
  });
}

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    console.log('✅ Database models synchronized.');
    
    return sequelize;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  await sequelize.close();
};

export default sequelize;
