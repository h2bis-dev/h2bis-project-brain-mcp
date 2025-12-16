import { mongoose } from '../database/index.js';
/**
 * Service for MongoDB document operations
 */
export class DocumentService {
    /**
     * Validate collection name
     */
    validateCollection(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Collection name must be a non-empty string');
        }
        if (name.startsWith('system.')) {
            throw new Error('Cannot access system collections');
        }
    }
    /**
     * Sanitize query to remove dangerous operators
     */
    sanitizeQuery(query) {
        const sanitized = { ...query };
        // Remove potentially dangerous operators
        delete sanitized.$where;
        return sanitized;
    }
    /**
     * Find a single document
     */
    async findOne(collection, query) {
        this.validateCollection(collection);
        const sanitized = this.sanitizeQuery(query);
        const db = mongoose.connection.db;
        return await db.collection(collection).findOne(sanitized);
    }
    /**
     * Find multiple documents
     */
    async findMany(collection, query, limit = 10) {
        this.validateCollection(collection);
        const sanitized = this.sanitizeQuery(query);
        if (limit < 1 || limit > 100) {
            throw new Error('Limit must be between 1 and 100');
        }
        const db = mongoose.connection.db;
        return await db.collection(collection).find(sanitized).limit(limit).toArray();
    }
}
//# sourceMappingURL=index.js.map