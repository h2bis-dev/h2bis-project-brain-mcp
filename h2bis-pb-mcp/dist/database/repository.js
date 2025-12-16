import { DatabaseConnection } from './connection.js';
import { DatabaseError } from '../core/errors/index.js';
import { createLogger } from '../core/logger/index.js';
import { config } from '../config/index.js';
/**
 * Generic repository for MongoDB collections
 * Provides CRUD operations with error handling and logging
 */
export class Repository {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.dbConnection = DatabaseConnection.getInstance();
        this.logger = createLogger(config.logging, {
            module: 'Repository',
            collection: collectionName,
        });
    }
    /**
     * Get the MongoDB collection
     */
    getCollection() {
        try {
            const connection = this.dbConnection.getConnection();
            return connection.db.collection(this.collectionName);
        }
        catch (error) {
            throw DatabaseError.fromMongoError(error, 'getCollection', this.collectionName);
        }
    }
    /**
     * Find documents matching the query
     */
    async find(query, limit = 100) {
        try {
            this.logger.debug('Finding documents', { query, limit });
            const collection = this.getCollection();
            const documents = await collection.find(query).limit(limit).toArray();
            this.logger.debug('Documents found', { count: documents.length });
            return documents;
        }
        catch (error) {
            this.logger.error('Find operation failed', error, { query, limit });
            throw DatabaseError.fromMongoError(error, 'find', this.collectionName);
        }
    }
    /**
     * Find a single document matching the query
     */
    async findOne(query) {
        try {
            this.logger.debug('Finding one document', { query });
            const collection = this.getCollection();
            const document = await collection.findOne(query);
            this.logger.debug('FindOne result', { found: !!document });
            return document;
        }
        catch (error) {
            this.logger.error('FindOne operation failed', error, { query });
            throw DatabaseError.fromMongoError(error, 'findOne', this.collectionName);
        }
    }
    /**
     * Insert a document
     */
    async insert(document) {
        try {
            this.logger.debug('Inserting document');
            const collection = this.getCollection();
            const result = await collection.insertOne(document);
            this.logger.info('Document inserted', { insertedId: result.insertedId });
            return result;
        }
        catch (error) {
            this.logger.error('Insert operation failed', error);
            throw DatabaseError.fromMongoError(error, 'insert', this.collectionName);
        }
    }
    /**
     * Update documents matching the query
     */
    async update(query, update) {
        try {
            this.logger.debug('Updating documents', { query });
            const collection = this.getCollection();
            const result = await collection.updateMany(query, { $set: update });
            this.logger.info('Documents updated', { modifiedCount: result.modifiedCount });
            return result;
        }
        catch (error) {
            this.logger.error('Update operation failed', error, { query });
            throw DatabaseError.fromMongoError(error, 'update', this.collectionName);
        }
    }
    /**
     * Delete documents matching the query
     */
    async delete(query) {
        try {
            this.logger.debug('Deleting documents', { query });
            const collection = this.getCollection();
            const result = await collection.deleteMany(query);
            this.logger.info('Documents deleted', { deletedCount: result.deletedCount });
            return result;
        }
        catch (error) {
            this.logger.error('Delete operation failed', error, { query });
            throw DatabaseError.fromMongoError(error, 'delete', this.collectionName);
        }
    }
    /**
     * Count documents matching the query
     */
    async count(query = {}) {
        try {
            this.logger.debug('Counting documents', { query });
            const collection = this.getCollection();
            const count = await collection.countDocuments(query);
            this.logger.debug('Document count', { count });
            return count;
        }
        catch (error) {
            this.logger.error('Count operation failed', error, { query });
            throw DatabaseError.fromMongoError(error, 'count', this.collectionName);
        }
    }
}
//# sourceMappingURL=repository.js.map