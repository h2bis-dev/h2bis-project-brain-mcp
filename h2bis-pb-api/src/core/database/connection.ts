import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';
import { config } from '../config/config.js';

let dbInstance: Db | null = null;
let clientInstance: MongoClient | null = null;

/**
 * Connect to MongoDB database
 */
export async function connectDb(): Promise<Db> {
    if (dbInstance) {
        return dbInstance;
    }

    try {
        // Connect native MongoDB driver
        clientInstance = new MongoClient(config.mongoUri);
        await clientInstance.connect();
        dbInstance = clientInstance.db(config.dbName);
        console.log(`✅ Connected to MongoDB: ${config.dbName}`);

        // Connect Mongoose — ensure exactly one "/" separates the URI from the DB name
        const baseUri = config.mongoUri.endsWith('/') ? config.mongoUri : `${config.mongoUri}/`;
        const mongooseUri = `${baseUri}${config.dbName}`;
        await mongoose.connect(mongooseUri, {
            // Disable automatic collection creation
            // Collections will only be created when first document is inserted
            autoCreate: false,
            autoIndex: false, // Also disable automatic index creation for performance
        });
        console.log(`✅ Mongoose connected to: ${config.dbName} (lazy collection mode)`);

        return dbInstance;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}

/**
 * Get database instance
 */
export async function getDb(): Promise<Db> {
    if (!dbInstance) {
        return await connectDb();
    }
    return dbInstance;
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDb(): Promise<void> {
    if (clientInstance) {
        await clientInstance.close();
        dbInstance = null;
        clientInstance = null;
        console.log('✅ MongoDB connection closed');
    }

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('✅ Mongoose disconnected');
    }
}
