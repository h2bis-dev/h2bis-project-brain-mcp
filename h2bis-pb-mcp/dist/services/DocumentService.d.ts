import { Document } from 'mongodb';
import { BaseService } from './BaseService.js';
/**
 * Document service for managing documents in MongoDB collections
 * Provides business logic layer on top of repository
 */
export declare class DocumentService extends BaseService {
    private repositories;
    constructor();
    /**
     * Get or create a repository for a collection
     */
    private getRepository;
    /**
     * Validate collection name
     */
    private validateCollectionName;
    /**
     * Validate query object
     */
    private validateQuery;
    /**
     * Find documents in a collection
     */
    findDocuments<T extends Document = Document>(collectionName: string, query: Record<string, any>, limit?: number): Promise<T[]>;
    /**
     * Find a single document in a collection
     */
    findOneDocument<T extends Document = Document>(collectionName: string, query: Record<string, any>): Promise<T | null>;
    /**
     * Insert a document into a collection
     */
    insertDocument<T extends Document = Document>(collectionName: string, document: T): Promise<any>;
    /**
     * Update documents in a collection
     */
    updateDocuments<T extends Document = Document>(collectionName: string, query: Record<string, any>, update: Partial<T>): Promise<any>;
    /**
     * Delete documents from a collection
     */
    deleteDocuments<T extends Document = Document>(collectionName: string, query: Record<string, any>): Promise<any>;
    /**
     * Count documents in a collection
     */
    countDocuments<T extends Document = Document>(collectionName: string, query?: Record<string, any>): Promise<number>;
}
//# sourceMappingURL=DocumentService.d.ts.map