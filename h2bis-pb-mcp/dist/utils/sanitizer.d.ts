/**
 * Sanitize user input to prevent NoSQL injection and XSS
 */
export declare class InputSanitizer {
    /**
     * Sanitize MongoDB query to prevent injection
     */
    static sanitizeQuery(query: any): any;
    /**
     * Sanitize string input to prevent XSS
     */
    static sanitizeString(input: string): string;
    /**
     * Validate and sanitize collection name
     */
    static sanitizeCollectionName(name: string): string;
}
//# sourceMappingURL=sanitizer.d.ts.map