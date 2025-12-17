import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
  dbName: process.env.DB_NAME || 'use_case_db',
  serverName: process.env.SERVER_NAME || 'h2bis-pb-mcp',
  serverVersion: process.env.SERVER_VERSION || '1.0.0',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
};