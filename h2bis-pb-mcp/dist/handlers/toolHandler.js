import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { BaseError } from '../core/errors/index.js';
/**
 * Handler for executing tools
 */
export function createToolHandler(registry, logger) {
    return async (request) => {
        const { name, arguments: args } = request.params;
        logger.info('Tool execution requested', { toolName: name });
        try {
            // Get the tool from registry
            const tool = registry.get(name);
            if (!tool) {
                logger.warn('Tool not found', { toolName: name });
                throw new Error(`Unknown tool: ${name}`);
            }
            // Execute the tool
            const result = await tool.execute(args);
            logger.info('Tool execution completed', { toolName: name });
            return result;
        }
        catch (error) {
            logger.error('Tool execution failed', error, { toolName: name });
            // Format error response
            const message = error instanceof BaseError
                ? error.toString()
                : error.message || 'Unknown error occurred';
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error executing tool '${name}': ${message}`,
                    },
                ],
                isError: true,
            };
        }
    };
}
/**
 * Setup the tool handler on the server
 */
export function setupToolHandler(server, registry, logger) {
    server.setRequestHandler(CallToolRequestSchema, createToolHandler(registry, logger));
}
//# sourceMappingURL=toolHandler.js.map