import { z } from 'zod';
import { BaseTool } from '../base/BaseTool.js';
import { MCPToolResponse } from '../../core/types/tool.types.js';
import { DocumentService } from '../../services/DocumentService.js';
/**
 * Input schema for retrieve_document tool
 */
export declare const retrieveDocumentInputSchema: z.ZodObject<{
    collection: z.ZodString;
    query: z.ZodRecord<z.ZodString, z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    collection: string;
    query: Record<string, any>;
}, {
    collection: string;
    query: Record<string, any>;
}>;
export type RetrieveDocumentInput = z.infer<typeof retrieveDocumentInputSchema>;
/**
 * Tool for retrieving a single document from a MongoDB collection
 */
export declare class RetrieveDocumentTool extends BaseTool<RetrieveDocumentInput, MCPToolResponse> {
    readonly name = "retrieve_document";
    readonly description = "Retrieve a single document from a MongoDB collection based on a query filter";
    readonly inputSchema: z.ZodSchema<RetrieveDocumentInput>;
    private documentService;
    constructor(documentService: DocumentService);
    /**
     * Execute the tool logic
     */
    protected run(input: RetrieveDocumentInput): Promise<MCPToolResponse>;
}
//# sourceMappingURL=RetrieveDocumentTool.d.ts.map