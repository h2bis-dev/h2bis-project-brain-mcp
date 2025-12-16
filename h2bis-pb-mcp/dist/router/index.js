import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { tools } from '../tools/index.js';
export function setupHandlers(server) {
    // Create a map for quick tool lookup
    const toolMap = new Map(tools.map(tool => [tool.name, tool]));
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools,
        };
    });
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        const tool = toolMap.get(name);
        if (!tool) {
            throw new Error(`Unknown tool: ${name}`);
        }
        // Parse arguments using the tool's schema
        const parsedArgs = tool.inputSchema.parse(args);
        return await tool.handler(parsedArgs);
    });
}
//# sourceMappingURL=index.js.map