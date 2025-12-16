import { DatabaseConnection } from './connection.js';
/**
 * Health check utilities for database
 */
export class DatabaseHealth {
    constructor() {
        this.dbConnection = DatabaseConnection.getInstance();
    }
    /**
     * Check if the database is healthy
     */
    async isHealthy() {
        return this.dbConnection.isConnected() && await this.dbConnection.ping();
    }
    /**
     * Get detailed health information
     */
    async getHealthInfo() {
        const connected = this.dbConnection.isConnected();
        const state = this.dbConnection.getState();
        const pingSuccessful = connected ? await this.dbConnection.ping() : false;
        return {
            connected,
            state,
            pingSuccessful,
        };
    }
}
//# sourceMappingURL=health.js.map