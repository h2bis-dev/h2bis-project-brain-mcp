import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools } from "./tools/index.js";
import { config } from "./core/config/config.js";

async function main() {
  try {
    // Create MCP server instance
    const server = new McpServer({
      name: config.serverName,
      version: config.serverVersion,
    });

    // Register tools
    for (const tool of tools) {
      server.registerTool(
        tool.name,
        {
          description: tool.description,
          inputSchema: tool.schema as any,
        },
        async (args: any) => {
          return await (tool.handler as any)(args);
        }
      );
    }

    // Connect server to stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`✅ ${config.serverName} v${config.serverVersion} running`);
    console.error(`🔗 API connection: ${config.apiBaseUrl}`);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.error('\n⏹️  Shutting down...');
      process.exit(0);
    });

    process.on('SIGTER', async () => {
      console.error('\n⏹️  Shutting down...');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start MCP server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
