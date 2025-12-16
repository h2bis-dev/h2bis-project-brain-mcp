import { z } from 'zod';
import { Logger } from '../../core/logger/index.js';
import { ITool, MCPTool, MCPToolResponse } from '../../core/types/tool.types.js';
/**
 * Abstract base class for all MCP tools
 * Provides standardized error handling, validation, and logging
 */
export declare abstract class BaseTool<TInput = any, TOutput = MCPToolResponse> implements ITool<TInput, TOutput> {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly inputSchema: z.ZodSchema<TInput>;
    protected logger?: Logger;
    constructor();
    /**
     * Get or create logger instance
     */
    protected getLogger(): Logger;
    /**
     * Get the MCP tool definition
     */
    getDefinition(): MCPTool;
    /**
     * Execute the tool with automatic validation and error handling
     */
    execute(input: TInput): Promise<TOutput>;
    /**
     * Abstract method that must be implemented by concrete tools
     */
    protected abstract run(input: TInput): Promise<TOutput>;
    /**
     * Validate input using the tool's schema
     */
    protected validateInput(input: any): Promise<TInput>;
    /**
     * Handle errors and convert to MCP response format
     */
    protected handleError(error: Error): MCPToolResponse;
    /**
     * Convert Zod schema to JSON Schema for MCP
     * Handles common Zod types used in our tools
     */
    private zodToJsonSchema;
    /**
     * Convert individual Zod type to JSON Schema type
     */
    private zodTypeToJsonSchema;
    /**
     * Create a successful response
     */
    protected createSuccessResponse(data: any): MCPToolResponse;
    /**
     * Create an error response
     */
    protected createErrorResponse(message: string): MCPToolResponse;
}
//# sourceMappingURL=BaseTool.d.ts.map