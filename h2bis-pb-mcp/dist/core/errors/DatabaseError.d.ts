import { BaseError } from './BaseError.js';
/**
 * Database-specific error class
 * Handles MongoDB errors and provides additional database context
 */
export declare class DatabaseError extends BaseError {
    readonly operation?: string;
    readonly collection?: string;
    constructor(message: string, operation?: string, collection?: string, context?: Record<string, any>);
    /**
     * Create a DatabaseError from a MongoDB error
     */
    static fromMongoError(error: any, operation?: string, collection?: string): DatabaseError;
    /**
     * Convert error to JSON with additional database fields
     */
    toJSON(): Record<string, any>;
}
//# sourceMappingURL=DatabaseError.d.ts.map