/**
 * Core type definitions for the MCP server
 */
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    handler: (args: any) => Promise<ToolResponse>;
}
export interface ToolResponse {
    content: Array<{
        type: string;
        text: string;
    }>;
    isError?: boolean;
}
export interface QueryOptions {
    collection: string;
    query: Record<string, any>;
    limit?: number;
}
export interface FindOneOptions {
    collection: string;
    query: Record<string, any>;
}
export interface FindManyOptions {
    collection: string;
    query: Record<string, any>;
    limit: number;
}
//# sourceMappingURL=index.d.ts.map