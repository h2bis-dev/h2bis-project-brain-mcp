import { Collection, Document, Filter, OptionalId } from 'mongodb';
import { DatabaseConnection } from './connection.js';
import { Logger } from '../core/logger/index.js';
import { IRepository } from '../core/types/index.js';
/**
 * Generic repository for MongoDB collections
 * Provides CRUD operations with error handling and logging
 */
export declare class Repository<T extends Document = Document> implements IRepository<T> {
    protected logger: Logger;
    protected collectionName: string;
    protected dbConnection: DatabaseConnection;
    constructor(collectionName: string);
    /**
     * Get the MongoDB collection
     */
    protected getCollection(): Collection<T>;
    /**
     * Find documents matching the query
     */
    find(query: Filter<T>, limit?: number): Promise<T[]>;
    /**
     * Find a single document matching the query
     */
    findOne(query: Filter<T>): Promise<T | null>;
    /**
     * Insert a document
     */
    insert(document: OptionalId<T>): Promise<any>;
    /**
     * Update documents matching the query
     */
    update(query: Filter<T>, update: Partial<T>): Promise<any>;
    /**
     * Delete documents matching the query
     */
    delete(query: Filter<T>): Promise<any>;
    /**
     * Count documents matching the query
     */
    count(query?: Filter<T>): Promise<number>;
}
//# sourceMappingURL=repository.d.ts.map