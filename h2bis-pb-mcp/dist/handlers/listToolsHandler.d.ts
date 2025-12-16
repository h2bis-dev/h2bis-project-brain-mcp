import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ToolRegistry } from '../tools/index.js';
import { Logger } from '../core/logger/index.js';
/**
 * Handler for listing available tools
 */
export declare function createListToolsHandler(registry: ToolRegistry, logger: Logger): () => Promise<{
    tools: import("../core/types/tool.types.js").MCPTool[];
}>;
/**
 * Setup the list tools handler on the server
 */
export declare function setupListToolsHandler(server: Server, registry: ToolRegistry, logger: Logger): void;
//# sourceMappingURL=listToolsHandler.d.ts.map