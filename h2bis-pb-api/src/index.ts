import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './core/config/config.js';
import { connectDb, disconnectDb } from './core/database/connection.js';
import apiRoutes from './routes.js';
import { errorHandler } from './core/middleware/error.middleware.js';

const app = express();

// Middleware
app.use(cors({
    origin: config.corsAllowedOrigins.split(/[\s,]+/).filter(Boolean),
    credentials: true
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
let server: ReturnType<typeof app.listen>;

async function startServer() {
    try {
        // Connect to database
        await connectDb();

        // Start Express server
        server = app.listen(config.port, () => {
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
async function shutdown() {
    console.log('\n⏹️  Shutting down API server...');
    if (server) {
        server.close();
    }
    await disconnectDb();
    process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();

