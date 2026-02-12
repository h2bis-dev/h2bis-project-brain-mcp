import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './infrastructure/config/config.js';
import { connectDb, disconnectDb } from './infrastructure/database/connection.js';
import apiRoutes from './api/routes/index.js';
import { errorHandler } from './api/middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies for refresh token

// API Routes (all under /api prefix)
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'h2bis-pb-api' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer() {
    try {
        // Connect to database
        await connectDb();

        // Start Express server
        app.listen(config.port, () => {
            console.log(`✅ API server running on port ${config.port}`);
            console.log(`✅ Environment: ${config.nodeEnv}`);
            console.log(`✅ Health check: http://localhost:${config.port}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏹️  Shutting down API server...');
    await disconnectDb();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⏹️  Shutting down API server...');
    await disconnectDb();
    process.exit(0);
});

startServer();

