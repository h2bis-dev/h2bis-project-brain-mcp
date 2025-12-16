import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
/**
 * Handler for listing available tools
 */
export function createListToolsHandler(registry, logger) {
    return async () => {
        logger.debug('Listing tools');
        const tools = registry.getAllDefinitions();
        logger.info('Tools listed', { count: tools.length });
        return {
            tools,
        };
    };
}
/**
 * Setup the list tools handler on the server
 */
export function setupListToolsHandler(server, registry, logger) {
    server.setRequestHandler(ListToolsRequestSchema, createListToolsHandler(registry, logger));
}
//# sourceMappingURL=listToolsHandler.js.map