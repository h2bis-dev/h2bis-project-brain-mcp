import { z } from 'zod';
/**
 * MCP tool definition interface
 */
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any;
}
/**
 * MCP tool handler response
 */
export interface MCPToolResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}
/**
 * Base tool interface that all tools must implement
 */
export interface ITool<TInput = any, TOutput = MCPToolResponse> {
    /**
     * Tool name (must be unique)
     */
    readonly name: string;
    /**
     * Tool description
     */
    readonly description: string;
    /**
     * Input validation schema (Zod schema)
     */
    readonly inputSchema: z.ZodSchema<TInput>;
    /**
     * Get the MCP tool definition
     */
    getDefinition(): MCPTool;
    /**
     * Execute the tool with validated input
     */
    execute(input: TInput): Promise<TOutput>;
}
/**
 * Tool execution context
 */
export interface ToolContext {
    toolName: string;
    startTime: Date;
}
//# sourceMappingURL=tool.types.d.ts.map