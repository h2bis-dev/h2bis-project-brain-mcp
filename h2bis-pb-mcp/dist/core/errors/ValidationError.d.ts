import { BaseError } from './BaseError.js';
/**
 * Validation error class
 * Used for input validation failures with field-level details
 */
export declare class ValidationError extends BaseError {
    readonly fields?: Record<string, string[]>;
    constructor(message: string, fields?: Record<string, string[]>, context?: Record<string, any>);
    /**
     * Create a ValidationError from Zod error
     */
    static fromZodError(error: any): ValidationError;
    /**
     * Convert error to JSON with field errors
     */
    toJSON(): Record<string, any>;
}
//# sourceMappingURL=ValidationError.d.ts.map