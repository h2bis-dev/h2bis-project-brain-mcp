import mongoose from 'mongoose';
export class DatabaseService {
    static async findDocuments(collection, query, limit = 10) {
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected');
            }
            const db = mongoose.connection.db;
            const docs = await db.collection(collection).find(query).limit(limit).toArray();
            return docs;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Database query failed: ${message}`);
        }
    }
    static async findOneDocument(collection, query) {
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected');
            }
            const db = mongoose.connection.db;
            const doc = await db.collection(collection).findOne(query);
            return doc;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Database query failed: ${message}`);
        }
    }
    static async insertDocument(collection, document) {
        try {
            if (mongoose.connection.readyState !== 1) {
                throw new Error('Database not connected');
            }
            const db = mongoose.connection.db;
            const result = await db.collection(collection).insertOne(document);
            return result;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Database insert failed: ${message}`);
        }
    }
}
//# sourceMappingURL=databaseService.js.map