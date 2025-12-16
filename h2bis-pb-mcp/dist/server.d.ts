import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ToolRegistry } from './tools/index.js';
/**
 * MCP Server for H2BIS ProjectBrain
 * Provides tools for querying and managing MongoDB documents
 */
export declare class ProjectBrainMCPServer {
    private server;
    private logger;
    private toolRegistry;
    private transport?;
    constructor();
    /**
     * Setup request handlers
     */
    private setupHandlers;
    /**
     * Start the MCP server
     */
    start(): Promise<void>;
    /**
     * Stop the MCP server gracefully
     */
    stop(): Promise<void>;
    /**
     * Get the MCP server instance
     */
    getServer(): Server;
    /**
     * Get the tool registry
     */
    getToolRegistry(): ToolRegistry;
}
//# sourceMappingURL=server.d.ts.map