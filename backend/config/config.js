import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
    storage: process.env.DATABASE_STORAGE || './database.sqlite'
  },
  azure: {
    emailConnectionString: process.env.AZURE_EMAIL_CONNECTION_STRING,
    senderEmail: process.env.AZURE_SENDER_EMAIL
  }
};
