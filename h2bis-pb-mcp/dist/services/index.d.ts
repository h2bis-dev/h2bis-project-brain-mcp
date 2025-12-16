/**
 * Service for MongoDB document operations
 */
export declare class DocumentService {
    /**
     * Validate collection name
     */
    private validateCollection;
    /**
     * Sanitize query to remove dangerous operators
     */
    private sanitizeQuery;
    /**
     * Find a single document
     */
    findOne(collection: string, query: Record<string, any>): Promise<any>;
    /**
     * Find multiple documents
     */
    findMany(collection: string, query: Record<string, any>, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=index.d.ts.map