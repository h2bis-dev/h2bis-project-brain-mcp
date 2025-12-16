import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from './config/index.js';
import { createLogger } from './core/logger/index.js';
import { createToolRegistry } from './tools/index.js';
import { setupListToolsHandler, setupToolHandler } from './handlers/index.js';
/**
 * MCP Server for H2BIS ProjectBrain
 * Provides tools for querying and managing MongoDB documents
 */
export class ProjectBrainMCPServer {
    constructor() {
        this.logger = createLogger(config.logging, { module: 'ProjectBrainMCPServer' });
        // Initialize MCP server
        this.server = new Server({
            name: config.server.name,
            version: config.server.version,
        }, {
            capabilities: {
                tools: {},
            },
        });
        // Initialize tool registry
        this.toolRegistry = createToolRegistry();
        this.logger.info('MCP Server initialized', {
            name: config.server.name,
            version: config.server.version,
            toolCount: this.toolRegistry.count(),
        });
        // Setup handlers
        this.setupHandlers();
    }
    /**
     * Setup request handlers
     */
    setupHandlers() {
        setupListToolsHandler(this.server, this.toolRegistry, this.logger);
        setupToolHandler(this.server, this.toolRegistry, this.logger);
        this.logger.debug('Request handlers configured');
    }
    /**
     * Start the MCP server
     */
    async start() {
        try {
            this.logger.info('Starting MCP server');
            // Create and connect transport
            this.transport = new StdioServerTransport();
            await this.server.connect(this.transport);
            this.logger.info('MCP Server started successfully', {
                transport: 'stdio',
            });
            // Log available tools
            const tools = this.toolRegistry.getAllDefinitions();
            this.logger.info('Available tools', {
                tools: tools.map((t) => t.name),
            });
        }
        catch (error) {
            this.logger.error('Failed to start MCP server', error);
            throw error;
        }
    }
    /**
     * Stop the MCP server gracefully
     */
    async stop() {
        try {
            this.logger.info('Stopping MCP server');
            if (this.transport) {
                await this.server.close();
            }
            this.logger.info('MCP server stopped');
        }
        catch (error) {
            this.logger.error('Error stopping MCP server', error);
            throw error;
        }
    }
    /**
     * Get the MCP server instance
     */
    getServer() {
        return this.server;
    }
    /**
     * Get the tool registry
     */
    getToolRegistry() {
        return this.toolRegistry;
    }
}
//# sourceMappingURL=server.js.map