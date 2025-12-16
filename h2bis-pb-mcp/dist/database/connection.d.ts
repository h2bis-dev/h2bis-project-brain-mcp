import mongoose from 'mongoose';
import { ConnectionState } from '../core/types/index.js';
/**
 * Database connection manager
 * Provides singleton connection with health monitoring and graceful shutdown
 */
export declare class DatabaseConnection {
    private static instance;
    private logger;
    private state;
    private reconnectAttempts;
    private readonly maxReconnectAttempts;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): DatabaseConnection;
    /**
     * Connect to MongoDB
     */
    connect(): Promise<void>;
    /**
     * Disconnect from MongoDB
     */
    disconnect(): Promise<void>;
    /**
     * Get the current connection state
     */
    getState(): ConnectionState;
    /**
     * Check if connected
     */
    isConnected(): boolean;
    /**
     * Get the native MongoDB connection
     */
    getConnection(): mongoose.Connection;
    /**
     * Ping the database to check connectivity
     */
    ping(): Promise<boolean>;
    /**
     * Setup event handlers for connection events
     */
    private setupEventHandlers;
    /**
     * Handle automatic reconnection
     */
    private handleReconnect;
    /**
     * Mask sensitive parts of the URI for logging
     */
    private maskUri;
}
/**
 * Get the database connection instance
 */
export declare const getDatabase: () => DatabaseConnection;
//# sourceMappingURL=connection.d.ts.map