/**
 * Database query result
 */
export interface QueryResult<T = any> {
    data: T;
    count?: number;
}
/**
 * Database connection state
 */
export declare enum ConnectionState {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    DISCONNECTING = "disconnecting",
    ERROR = "error"
}
/**
 * Service interface that all services should implement
 */
export interface IService {
    /**
     * Service name for logging
     */
    readonly serviceName: string;
}
/**
 * Repository interface for database operations
 */
export interface IRepository<T = any> {
    find(query: Record<string, any>, limit?: number): Promise<T[]>;
    findOne(query: Record<string, any>): Promise<T | null>;
    insert(document: any): Promise<any>;
    update(query: Record<string, any>, update: Record<string, any>): Promise<any>;
    delete(query: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map