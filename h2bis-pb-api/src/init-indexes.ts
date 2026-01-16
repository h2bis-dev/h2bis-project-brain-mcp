import { createCapabilityIndexes } from './utils/create-indexes.js';
import { connectDb, disconnectDb } from './infrastructure/database/connection.js';

/**
 * Initialize database indexes
 * Run this script when deploying or setting up the database
 */
async function initIndexes() {
    try {
        console.log('🔧 Initializing database indexes...');

        // Connect to database
        await connectDb();
        console.log('✅ Connected to database');

        // Create indexes
        await createCapabilityIndexes();

        console.log('🎉 Index initialization complete');

        // Close connection
        await disconnectDb();
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to initialize indexes:', error);
        process.exit(1);
    }
}

initIndexes();
