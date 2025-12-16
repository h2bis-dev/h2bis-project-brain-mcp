import { BaseError } from './BaseError.js';
/**
 * Validation error class
 * Used for input validation failures with field-level details
 */
export class ValidationError extends BaseError {
    constructor(message, fields, context) {
        super(message, 'VALIDATION_ERROR', 400, context);
        this.fields = fields;
    }
    /**
     * Create a ValidationError from Zod error
     */
    static fromZodError(error) {
        const fields = {};
        if (error.errors && Array.isArray(error.errors)) {
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                if (!fields[path]) {
                    fields[path] = [];
                }
                fields[path].push(err.message);
            });
        }
        return new ValidationError('Validation failed', fields, { zodError: error.message });
    }
    /**
     * Convert error to JSON with field errors
     */
    toJSON() {
        return {
            ...super.toJSON(),
            fields: this.fields,
        };
    }
}
//# sourceMappingURL=ValidationError.js.map