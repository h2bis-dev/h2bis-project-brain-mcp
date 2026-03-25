import dotenv from 'dotenv';

dotenv.config();

export const config = {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    dbName: process.env.DB_NAME || 'h2bis-project-brain',
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
};
