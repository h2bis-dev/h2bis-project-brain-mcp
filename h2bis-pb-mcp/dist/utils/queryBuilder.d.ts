import { Filter } from 'mongodb';
/**
 * Query builder utilities for MongoDB
 */
export declare class QueryBuilder {
    /**
     * Build a text search query
     */
    static textSearch(text: string, field?: string): Filter<any>;
    /**
     * Build a range query
     */
    static range<T>(field: string, min?: T, max?: T): Filter<any>;
    /**
     * Build an in query
     */
    static in<T>(field: string, values: T[]): Filter<any>;
    /**
     * Build an exists query
     */
    static exists(field: string, exists?: boolean): Filter<any>;
    /**
     * Combine multiple queries with AND
     */
    static and(...queries: Filter<any>[]): Filter<any>;
    /**
     * Combine multiple queries with OR
     */
    static or(...queries: Filter<any>[]): Filter<any>;
}
//# sourceMappingURL=queryBuilder.d.ts.map