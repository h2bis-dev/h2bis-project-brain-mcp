/**
 * Health check utilities for database
 */
export declare class DatabaseHealth {
    private dbConnection;
    constructor();
    /**
     * Check if the database is healthy
     */
    isHealthy(): Promise<boolean>;
    /**
     * Get detailed health information
     */
    getHealthInfo(): Promise<{
        connected: boolean;
        state: string;
        pingSuccessful: boolean;
    }>;
}
//# sourceMappingURL=health.d.ts.map