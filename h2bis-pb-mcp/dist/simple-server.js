import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { connectDB, disconnectDB } from './simple-database.js';
import { tools } from './simple-tools.js';
async function main() {
    console.error('🚀 Starting Simple MCP Server...');
    // Connect to database
    await connectDB();
    // Create MCP server
    const server = new Server({
        name: 'h2bis-pb-mcp',
        version: '1.0.0',
    }, {
        capabilities: {
            tools: {},
        },
    });
    // List tools handler
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        console.error('📋 Listing tools');
        return { tools };
    });
    // Call tool handler
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        console.error(`🔧 Calling tool: ${name}`);
        const tool = tools.find(t => t.name === name);
        if (!tool) {
            throw new Error(`Tool not found: ${name}`);
        }
        try {
            return await tool.handler(args);
        }
        catch (error) {
            console.error('❌ Tool error:', error.message);
            return {
                content: [{ type: 'text', text: `Error: ${error.message}` }],
                isError: true,
            };
        }
    });
    // Connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('✅ MCP Server ready!');
    console.error('📚 Available tools:', tools.map(t => t.name).join(', '));
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.error('🛑 Shutting down...');
        await disconnectDB();
        process.exit(0);
    });
}
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=simple-server.js.map