import { BaseService } from './BaseService.js';
import { Repository } from '../database/repository.js';
import { ValidationError } from '../core/errors/index.js';
/**
 * Document service for managing documents in MongoDB collections
 * Provides business logic layer on top of repository
 */
export class DocumentService extends BaseService {
    constructor() {
        super('DocumentService');
        this.repositories = new Map();
    }
    /**
     * Get or create a repository for a collection
     */
    getRepository(collectionName) {
        if (!this.repositories.has(collectionName)) {
            this.repositories.set(collectionName, new Repository(collectionName));
        }
        return this.repositories.get(collectionName);
    }
    /**
     * Validate collection name
     */
    validateCollectionName(collectionName) {
        if (!collectionName || typeof collectionName !== 'string') {
            throw new ValidationError('Collection name is required and must be a string');
        }
        if (collectionName.trim().length === 0) {
            throw new ValidationError('Collection name cannot be empty');
        }
        // MongoDB collection name restrictions
        if (collectionName.includes('\0') || collectionName.includes('$')) {
            throw new ValidationError('Collection name contains invalid characters');
        }
        if (collectionName.startsWith('system.')) {
            throw new ValidationError('Cannot access system collections');
        }
    }
    /**
     * Validate query object
     */
    validateQuery(query) {
        if (query === null || query === undefined) {
            throw new ValidationError('Query cannot be null or undefined');
        }
        if (typeof query !== 'object' || Array.isArray(query)) {
            throw new ValidationError('Query must be an object');
        }
    }
    /**
     * Find documents in a collection
     */
    async findDocuments(collectionName, query, limit = 10) {
        const operation = 'findDocuments';
        this.logOperationStart(operation, { collectionName, query, limit });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            this.validateQuery(query);
            if (typeof limit !== 'number' || limit < 1 || limit > 1000) {
                throw new ValidationError('Limit must be a number between 1 and 1000');
            }
            // Execute query
            const repository = this.getRepository(collectionName);
            const documents = await repository.find(query, limit);
            this.logOperationSuccess(operation, {
                collectionName,
                count: documents.length,
            });
            return documents;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName, query, limit });
            throw error;
        }
    }
    /**
     * Find a single document in a collection
     */
    async findOneDocument(collectionName, query) {
        const operation = 'findOneDocument';
        this.logOperationStart(operation, { collectionName, query });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            this.validateQuery(query);
            // Execute query
            const repository = this.getRepository(collectionName);
            const document = await repository.findOne(query);
            this.logOperationSuccess(operation, {
                collectionName,
                found: !!document,
            });
            return document;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName, query });
            throw error;
        }
    }
    /**
     * Insert a document into a collection
     */
    async insertDocument(collectionName, document) {
        const operation = 'insertDocument';
        this.logOperationStart(operation, { collectionName });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            if (!document || typeof document !== 'object') {
                throw new ValidationError('Document must be a valid object');
            }
            // Execute insert
            const repository = this.getRepository(collectionName);
            const result = await repository.insert(document);
            this.logOperationSuccess(operation, {
                collectionName,
                insertedId: result.insertedId,
            });
            return result;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName });
            throw error;
        }
    }
    /**
     * Update documents in a collection
     */
    async updateDocuments(collectionName, query, update) {
        const operation = 'updateDocuments';
        this.logOperationStart(operation, { collectionName, query });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            this.validateQuery(query);
            if (!update || typeof update !== 'object') {
                throw new ValidationError('Update must be a valid object');
            }
            // Execute update
            const repository = this.getRepository(collectionName);
            const result = await repository.update(query, update);
            this.logOperationSuccess(operation, {
                collectionName,
                modifiedCount: result.modifiedCount,
            });
            return result;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName, query });
            throw error;
        }
    }
    /**
     * Delete documents from a collection
     */
    async deleteDocuments(collectionName, query) {
        const operation = 'deleteDocuments';
        this.logOperationStart(operation, { collectionName, query });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            this.validateQuery(query);
            // Execute delete
            const repository = this.getRepository(collectionName);
            const result = await repository.delete(query);
            this.logOperationSuccess(operation, {
                collectionName,
                deletedCount: result.deletedCount,
            });
            return result;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName, query });
            throw error;
        }
    }
    /**
     * Count documents in a collection
     */
    async countDocuments(collectionName, query = {}) {
        const operation = 'countDocuments';
        this.logOperationStart(operation, { collectionName, query });
        try {
            // Validate inputs
            this.validateCollectionName(collectionName);
            this.validateQuery(query);
            // Execute count
            const repository = this.getRepository(collectionName);
            const count = await repository.count(query);
            this.logOperationSuccess(operation, {
                collectionName,
                count,
            });
            return count;
        }
        catch (error) {
            this.logOperationError(operation, error, { collectionName, query });
            throw error;
        }
    }
}
//# sourceMappingURL=DocumentService.js.map