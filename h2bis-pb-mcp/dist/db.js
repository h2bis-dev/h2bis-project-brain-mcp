import { MongoClient } from "mongodb";
import { config } from "./config/config.js";
let dbInstance = null;
let clientInstance = null;
/**
 * Initialize database connection
 */
export async function initDb() {
    if (dbInstance) {
        return dbInstance;
    }
    try {
        clientInstance = new MongoClient(config.mongoUri);
        await clientInstance.connect();
        dbInstance = clientInstance.db(config.dbName);
        console.error(`✅ Connected to MongoDB: ${config.dbName}`);
        return dbInstance;
    }
    catch (error) {
        console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : String(error));
        throw error;
    }
}
/**
 * Get database instance (must call initDb first)
 */
export async function getDb() {
    if (!dbInstance) {
        return await initDb();
    }
    return dbInstance;
}
/**
 * Close database connection
 */
export async function closeDb() {
    if (clientInstance) {
        await clientInstance.close();
        dbInstance = null;
        clientInstance = null;
        console.error('✅ MongoDB connection closed');
    }
}
//# sourceMappingURL=db.js.map