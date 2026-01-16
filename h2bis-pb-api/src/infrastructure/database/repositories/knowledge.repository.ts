import { getDb } from '../connection.js';
import type { Document, InsertOneResult, UpdateResult, DeleteResult } from 'mongodb';

/**
 * Knowledge Repository
 * Handles all database operations for knowledge entities (features, use cases, etc.)
 */
export class KnowledgeRepository {
    /**
     * Insert a document into a collection
     */
    async insertOne(collectionName: string, document: Document): Promise<InsertOneResult> {
        const db = await getDb();
        const result = await db.collection(collectionName).insertOne(document);
        return result;
    }

    /**
     * Find a single document in a collection
     */
    async findOne(collectionName: string, filter: Document): Promise<Document | null> {
        const db = await getDb();
        const document = await db.collection(collectionName).findOne(filter);
        return document;
    }

    /**
     * Find multiple documents in a collection
     */
    async find(collectionName: string, filter: Document): Promise<Document[]> {
        const db = await getDb();
        const documents = await db.collection(collectionName).find(filter).toArray();
        return documents;
    }

    /**
     * Replace a document in a collection (full replacement, not partial update)
     */
    async replaceOne(collectionName: string, filter: Document, document: Document): Promise<UpdateResult> {
        const db = await getDb();
        const result = await db.collection(collectionName).replaceOne(filter, document);
        return result;
    }

    /**
     * Delete multiple documents from a collection
     */
    async deleteMany(collectionName: string, filter: Document): Promise<DeleteResult> {
        const db = await getDb();
        const result = await db.collection(collectionName).deleteMany(filter);
        return result;
    }

    /**
     * List all collections in the database
     */
    async listCollections(): Promise<string[]> {
        const db = await getDb();
        const collections = await db.listCollections().toArray();
        return collections.map(col => col.name);
    }
}

// Export singleton instance
export const knowledgeRepository = new KnowledgeRepository();
