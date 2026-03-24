#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tools } from "./tools/index.js";
import { config } from "./core/config/config.js";
import { authService } from "./core/services/auth.service.js";
import { logger } from "./core/utils/logger.js";


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

    // Connect server to stdio transport first so VS Code sees the server as alive.
    // Authentication runs in the background (started in ApiService constructor).
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info(`🔗 ${config.serverName} v${config.serverVersion} connected to ${config.apiBaseUrl}`);

    // Wait for the auth handshake to finish (GitHub OAuth, persisted token, etc.).
    // Tool calls also await this via authService.getAuthHeaders(), but awaiting here
    // lets us log the auth outcome clearly at startup.
    await authService.waitForAuth();

    if (authService.isAuthenticated) {
      logger.info(`✅ ${config.serverName} v${config.serverVersion} running — authenticated`);
    } else if (authService.isPendingApproval) {
      logger.warn(`⏳ ${config.serverName} running — account pending admin approval`);
    } else {
      logger.warn(`⚠️ ${config.serverName} running — not authenticated (tools will retry on first use)`);
    }

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('\n⏹️  Shutting down...');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('\n⏹️  Shutting down...');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ Failed to start MCP server: ' + (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

main();
