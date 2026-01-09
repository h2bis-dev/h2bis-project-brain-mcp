import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { connectDb, disconnectDb } from './db.js';
import knowledgeRoutes from './routes/knowledge.js';
import capabilityRoutes from './routes/capability.js';
import { errorHandler } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/capabilities', capabilityRoutes);
app.use('/api/auth', authRoutes);

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
