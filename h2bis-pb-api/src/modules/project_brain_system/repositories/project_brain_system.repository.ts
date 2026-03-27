import { getDb } from '../../../core/database/connection.js';
import { NotFoundError } from '../../../core/errors/app.error.js';

/**
 * Project Brain System Repository
 * Handles all database operations for the project brain system
 * This is a meta-repository that can access any collection dynamically
 */
export class ProjectBrainSystemRepository {
    /**
     * List all collections in the database
     */
    async listCollections(includeSystem: boolean = false): Promise<string[]> {
        const db = await getDb();
        const collections = await db.listCollections().toArray();
        
        let collectionNames = collections.map(col => col.name);
        
        // Filter out system collections if requested
        if (!includeSystem) {
            collectionNames = collectionNames.filter(name => 
                !name.startsWith('system.')
            );
        }
        
        return collectionNames;
    }

    /**
     * Find documents in a collection
     */
    async findDocuments(
        collectionName: string,
        filter: Record<string, any> = {},
        options?: { limit?: number; skip?: number }
    ): Promise<any[]> {
        const db = await getDb();
        
        let query = db.collection(collectionName).find(filter);
        
        if (options?.skip) {
            query = query.skip(options.skip);
        }
        
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        
        const documents = await query.toArray();
        return documents;
    }

    /**
     * Insert a document into a collection
     */
    async insertDocument(
        collectionName: string,
        document: Record<string, any>
    ): Promise<string> {
        const db = await getDb();
        
        const result = await db.collection(collectionName).insertOne(document);
        
        // Return the inserted ID (either custom _id or generated ObjectId)
        return result.insertedId.toString();
    }

    /**
     * Update a document in a collection
     */
    async updateDocument(
        collectionName: string,
        filter: Record<string, any>,
        update: Record<string, any>
    ): Promise<number> {
        const db = await getDb();
        
        // Use $set operator if not already specified
        const updateOperation = update.$set || update.$unset || update.$inc
            ? update
            : { $set: update };
        
        const result = await db.collection(collectionName).updateOne(
            filter,
            updateOperation
        );
        
        if (result.matchedCount === 0) {
            throw new NotFoundError(`No document found matching filter in collection: ${collectionName}`);
        }
        
        return result.modifiedCount;
    }

    /**
     * Delete a document from a collection
     */
    async deleteDocument(
        collectionName: string,
        filter: Record<string, any>
    ): Promise<number> {
        const db = await getDb();
        
        const result = await db.collection(collectionName).deleteOne(filter);
        
        if (result.deletedCount === 0) {
            throw new NotFoundError(`No document found matching filter in collection: ${collectionName}`);
        }
        
        return result.deletedCount;
    }

    /**
     * Count documents in a collection
     */
    async countDocuments(
        collectionName: string,
        filter: Record<string, any> = {}
    ): Promise<number> {
        const db = await getDb();
        return await db.collection(collectionName).countDocuments(filter);
    }
}

// Export singleton instance
export const projectBrainSystemRepository = new ProjectBrainSystemRepository();
