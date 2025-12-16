/**
 * Base error class for all custom errors in the application
 * Provides consistent error structure with code, message, and context
 */
export declare class BaseError extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly context?: Record<string, any>;
    readonly timestamp: Date;
    constructor(message: string, code: string, statusCode?: number, context?: Record<string, any>);
    /**
     * Convert error to a JSON-serializable object
     */
    toJSON(): Record<string, any>;
    /**
     * Convert error to a user-friendly string
     */
    toString(): string;
}
//# sourceMappingURL=BaseError.d.ts.map