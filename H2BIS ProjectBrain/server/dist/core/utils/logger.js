/**
 * Logger — MCP stdio-safe diagnostic output.
 *
 * In an MCP server that uses the stdio transport, process.stdout is the
 * JSON-RPC channel and must never be used for human-readable output.
 * All diagnostic messages must go to process.stderr.
 *
 * This module wraps process.stderr so the rest of the codebase can call
 * semantically correct methods (info / warn / error) instead of the
 * misleading console.error() that was previously used everywhere.
 */
const write = (msg) => {
    process.stderr.write(msg + '\n');
};
export const logger = {
    /** Informational message — normal operation progress. */
    info: (msg) => write(msg),
    /** Warning — something unexpected but recoverable. */
    warn: (msg) => write(msg),
    /** Error — an actual failure that may require user action. */
    error: (msg) => write(msg),
};
//# sourceMappingURL=logger.js.map