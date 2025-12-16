import { z } from 'zod';
import { BaseTool } from '../base/BaseTool.js';
import { MCPToolResponse } from '../../core/types/tool.types.js';
import { DocumentService } from '../../services/DocumentService.js';
/**
 * Input schema for retrieve_documents tool
 */
declare const retrieveDocumentsInputSchema: z.ZodObject<{
    collection: z.ZodString;
    query: z.ZodRecord<z.ZodString, z.ZodAny>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    collection: string;
    query: Record<string, any>;
    limit: number;
}, {
    collection: string;
    query: Record<string, any>;
    limit?: number | undefined;
}>;
export type RetrieveDocumentsInput = z.infer<typeof retrieveDocumentsInputSchema>;
/**
 * Tool for retrieving multiple documents from a MongoDB collection
 */
export declare class RetrieveDocumentsTool extends BaseTool<RetrieveDocumentsInput, MCPToolResponse> {
    readonly name = "retrieve_documents";
    readonly description = "Retrieve documents from a MongoDB collection based on a query filter";
    readonly inputSchema: z.ZodSchema<RetrieveDocumentsInput>;
    private documentService;
    constructor(documentService: DocumentService);
    /**
     * Execute the tool logic
     */
    protected run(input: RetrieveDocumentsInput): Promise<MCPToolResponse>;
}
export {};
//# sourceMappingURL=RetrieveDocumentsTool.d.ts.map