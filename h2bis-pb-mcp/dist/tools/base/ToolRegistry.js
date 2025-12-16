import { createLogger } from '../../core/logger/index.js';
import { config } from '../../config/index.js';
/**
 * Tool registry for managing and discovering tools
 */
export class ToolRegistry {
    constructor() {
        this.tools = new Map();
        this.logger = createLogger(config.logging, { module: 'ToolRegistry' });
    }
    /**
     * Register a tool
     */
    register(tool) {
        if (this.tools.has(tool.name)) {
            this.logger.warn(`Tool already registered, overwriting`, { toolName: tool.name });
        }
        this.tools.set(tool.name, tool);
        this.logger.info(`Tool registered`, { toolName: tool.name });
    }
    /**
     * Register multiple tools
     */
    registerMany(tools) {
        tools.forEach((tool) => this.register(tool));
    }
    /**
     * Get a tool by name
     */
    get(name) {
        return this.tools.get(name);
    }
    /**
     * Check if a tool exists
     */
    has(name) {
        return this.tools.has(name);
    }
    /**
     * Get all registered tools
     */
    getAll() {
        return Array.from(this.tools.values());
    }
    /**
     * Get all tool definitions for MCP listing
     */
    getAllDefinitions() {
        return this.getAll().map((tool) => tool.getDefinition());
    }
    /**
     * Get the count of registered tools
     */
    count() {
        return this.tools.size;
    }
    /**
     * Clear all registered tools
     */
    clear() {
        this.logger.info('Clearing all tools');
        this.tools.clear();
    }
    /**
     * Unregister a tool by name
     */
    unregister(name) {
        const deleted = this.tools.delete(name);
        if (deleted) {
            this.logger.info(`Tool unregistered`, { toolName: name });
        }
        return deleted;
    }
}
//# sourceMappingURL=ToolRegistry.js.map