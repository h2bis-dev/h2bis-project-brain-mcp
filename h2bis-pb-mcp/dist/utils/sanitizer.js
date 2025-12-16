/**
 * Sanitize user input to prevent NoSQL injection and XSS
 */
export class InputSanitizer {
    /**
     * Sanitize MongoDB query to prevent injection
     */
    static sanitizeQuery(query) {
        if (query === null || query === undefined) {
            return query;
        }
        if (typeof query !== 'object' || Array.isArray(query)) {
            return query;
        }
        const sanitized = {};
        for (const [key, value] of Object.entries(query)) {
            // Block keys that start with $ (MongoDB operators from user input)
            // Allow known safe operators
            const safeOperators = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin'];
            if (key.startsWith('$') && !safeOperators.includes(key)) {
                continue; // Skip potentially dangerous operators
            }
            // Recursively sanitize nested objects
            if (value !== null && typeof value === 'object') {
                sanitized[key] = this.sanitizeQuery(value);
            }
            else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
    /**
     * Sanitize string input to prevent XSS
     */
    static sanitizeString(input) {
        if (typeof input !== 'string') {
            return input;
        }
        return input
            .replace(/[<>]/g, '') // Remove angle brackets
            .trim();
    }
    /**
     * Validate and sanitize collection name
     */
    static sanitizeCollectionName(name) {
        if (typeof name !== 'string') {
            throw new Error('Collection name must be a string');
        }
        return name
            .replace(/[^a-zA-Z0-9_-]/g, '') // Allow only alphanumeric, underscore, hyphen
            .trim();
    }
}
//# sourceMappingURL=sanitizer.js.map