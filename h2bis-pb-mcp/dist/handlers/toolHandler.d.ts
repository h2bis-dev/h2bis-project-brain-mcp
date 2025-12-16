import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ToolRegistry } from '../tools/index.js';
import { Logger } from '../core/logger/index.js';
/**
 * Handler for executing tools
 */
export declare function createToolHandler(registry: ToolRegistry, logger: Logger): (request: any) => Promise<any>;
/**
 * Setup the tool handler on the server
 */
export declare function setupToolHandler(server: Server, registry: ToolRegistry, logger: Logger): void;
//# sourceMappingURL=toolHandler.d.ts.map