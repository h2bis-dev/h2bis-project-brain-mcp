/**
 * Custom error for tool execution failures
 */
export class ToolError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'ToolError';
    }
}
/**
 * Format any error into a ToolResponse
 */
export function formatToolError(error) {
    if (error instanceof ToolError) {
        return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true
        };
    }
    if (error instanceof Error) {
        return {
            content: [{ type: 'text', text: `Error: ${error.message}` }],
            isError: true
        };
    }
    return {
        content: [{ type: 'text', text: 'An unknown error occurred' }],
        isError: true
    };
}
//# sourceMappingURL=errors.js.map