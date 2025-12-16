import { ITool, MCPTool } from '../../core/types/tool.types.js';
/**
 * Tool registry for managing and discovering tools
 */
export declare class ToolRegistry {
    private tools;
    private logger;
    constructor();
    /**
     * Register a tool
     */
    register(tool: ITool): void;
    /**
     * Register multiple tools
     */
    registerMany(tools: ITool[]): void;
    /**
     * Get a tool by name
     */
    get(name: string): ITool | undefined;
    /**
     * Check if a tool exists
     */
    has(name: string): boolean;
    /**
     * Get all registered tools
     */
    getAll(): ITool[];
    /**
     * Get all tool definitions for MCP listing
     */
    getAllDefinitions(): MCPTool[];
    /**
     * Get the count of registered tools
     */
    count(): number;
    /**
     * Clear all registered tools
     */
    clear(): void;
    /**
     * Unregister a tool by name
     */
    unregister(name: string): boolean;
}
//# sourceMappingURL=ToolRegistry.d.ts.map