/**
 * Base error class for all custom errors in the application
 * Provides consistent error structure with code, message, and context
 */
export class BaseError extends Error {
    constructor(message, code, statusCode = 500, context) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
        this.timestamp = new Date();
        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Convert error to a JSON-serializable object
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            context: this.context,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack,
        };
    }
    /**
     * Convert error to a user-friendly string
     */
    toString() {
        return `[${this.code}] ${this.message}`;
    }
}
//# sourceMappingURL=BaseError.js.map