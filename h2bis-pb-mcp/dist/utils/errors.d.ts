import { ToolResponse } from '../types/index.js';
/**
 * Custom error for tool execution failures
 */
export declare class ToolError extends Error {
    details?: any | undefined;
    constructor(message: string, details?: any | undefined);
}
/**
 * Format any error into a ToolResponse
 */
export declare function formatToolError(error: unknown): ToolResponse;
//# sourceMappingURL=errors.d.ts.map