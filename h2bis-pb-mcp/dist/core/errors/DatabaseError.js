import { BaseError } from './BaseError.js';
/**
 * Database-specific error class
 * Handles MongoDB errors and provides additional database context
 */
export class DatabaseError extends BaseError {
    constructor(message, operation, collection, context) {
        super(message, 'DATABASE_ERROR', 500, context);
        this.operation = operation;
        this.collection = collection;
    }
    /**
     * Create a DatabaseError from a MongoDB error
     */
    static fromMongoError(error, operation, collection) {
        const message = error.message || 'Database operation failed';
        const context = {
            mongoErrorCode: error.code,
            mongoErrorName: error.name,
        };
        // Map common MongoDB errors to user-friendly messages
        if (error.code === 11000) {
            return new DatabaseError('Duplicate key error: A document with this key already exists', operation, collection, context);
        }
        if (error.name === 'MongoNetworkError') {
            return new DatabaseError('Database connection error: Unable to reach the database', operation, collection, context);
        }
        if (error.name === 'MongoTimeoutError') {
            return new DatabaseError('Database timeout: Operation took too long to complete', operation, collection, context);
        }
        return new DatabaseError(message, operation, collection, context);
    }
    /**
     * Convert error to JSON with additional database fields
     */
    toJSON() {
        return {
            ...super.toJSON(),
            operation: this.operation,
            collection: this.collection,
        };
    }
}
//# sourceMappingURL=DatabaseError.js.map