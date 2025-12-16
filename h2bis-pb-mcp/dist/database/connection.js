import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { DatabaseError } from '../core/errors/index.js';
import { createLogger } from '../core/logger/index.js';
import { ConnectionState } from '../core/types/index.js';
/**
 * Database connection manager
 * Provides singleton connection with health monitoring and graceful shutdown
 */
export class DatabaseConnection {
    constructor() {
        this.state = ConnectionState.DISCONNECTED;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.logger = createLogger(config.logging, { module: 'DatabaseConnection' });
        this.setupEventHandlers();
    }
    /**
     * Get the singleton instance
     */
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    /**
     * Connect to MongoDB
     */
    async connect() {
        if (this.state === ConnectionState.CONNECTED) {
            this.logger.debug('Already connected to database');
            return;
        }
        if (this.state === ConnectionState.CONNECTING) {
            this.logger.debug('Connection already in progress');
            return;
        }
        try {
            this.state = ConnectionState.CONNECTING;
            this.logger.info('Connecting to MongoDB', {
                uri: this.maskUri(config.database.uri),
                dbName: config.database.dbName,
            });
            await mongoose.connect(config.database.uri, {
                dbName: config.database.dbName,
                maxPoolSize: config.database.maxPoolSize,
                minPoolSize: config.database.minPoolSize,
                serverSelectionTimeoutMS: config.database.serverSelectionTimeoutMS,
                socketTimeoutMS: config.database.socketTimeoutMS,
            });
            this.state = ConnectionState.CONNECTED;
            this.reconnectAttempts = 0;
            this.logger.info('Successfully connected to MongoDB');
        }
        catch (error) {
            this.state = ConnectionState.ERROR;
            this.logger.error('Failed to connect to MongoDB', error);
            throw DatabaseError.fromMongoError(error, 'connect');
        }
    }
    /**
     * Disconnect from MongoDB
     */
    async disconnect() {
        if (this.state === ConnectionState.DISCONNECTED) {
            return;
        }
        try {
            this.state = ConnectionState.DISCONNECTING;
            this.logger.info('Disconnecting from MongoDB');
            await mongoose.disconnect();
            this.state = ConnectionState.DISCONNECTED;
            this.logger.info('Successfully disconnected from MongoDB');
        }
        catch (error) {
            this.state = ConnectionState.ERROR;
            this.logger.error('Error disconnecting from MongoDB', error);
            throw DatabaseError.fromMongoError(error, 'disconnect');
        }
    }
    /**
     * Get the current connection state
     */
    getState() {
        return this.state;
    }
    /**
     * Check if connected
     */
    isConnected() {
        return this.state === ConnectionState.CONNECTED && mongoose.connection.readyState === 1;
    }
    /**
     * Get the native MongoDB connection
     */
    getConnection() {
        if (!this.isConnected()) {
            throw new DatabaseError('Database not connected', 'getConnection');
        }
        return mongoose.connection;
    }
    /**
     * Ping the database to check connectivity
     */
    async ping() {
        try {
            if (!this.isConnected()) {
                return false;
            }
            await mongoose.connection.db?.admin().ping();
            return true;
        }
        catch (error) {
            this.logger.warn('Database ping failed', { error });
            return false;
        }
    }
    /**
     * Setup event handlers for connection events
     */
    setupEventHandlers() {
        mongoose.connection.on('connected', () => {
            this.state = ConnectionState.CONNECTED;
            this.logger.info('Mongoose connected to MongoDB');
        });
        mongoose.connection.on('error', (error) => {
            this.state = ConnectionState.ERROR;
            this.logger.error('Mongoose connection error', error);
        });
        mongoose.connection.on('disconnected', () => {
            this.state = ConnectionState.DISCONNECTED;
            this.logger.warn('Mongoose disconnected from MongoDB');
            this.handleReconnect();
        });
        mongoose.connection.on('reconnected', () => {
            this.state = ConnectionState.CONNECTED;
            this.reconnectAttempts = 0;
            this.logger.info('Mongoose reconnected to MongoDB');
        });
    }
    /**
     * Handle automatic reconnection
     */
    async handleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logger.error('Max reconnection attempts reached');
            return;
        }
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`, {
            delay,
        });
        setTimeout(() => {
            this.connect().catch((error) => {
                this.logger.error('Reconnection attempt failed', error);
            });
        }, delay);
    }
    /**
     * Mask sensitive parts of the URI for logging
     */
    maskUri(uri) {
        try {
            const url = new URL(uri);
            if (url.password) {
                url.password = '****';
            }
            return url.toString();
        }
        catch {
            return 'invalid-uri';
        }
    }
}
/**
 * Get the database connection instance
 */
export const getDatabase = () => DatabaseConnection.getInstance();
//# sourceMappingURL=connection.js.map