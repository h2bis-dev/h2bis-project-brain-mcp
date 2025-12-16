import { z } from 'zod';
import { BaseTool } from '../base/BaseTool.js';
/**
 * Input schema for retrieve_documents tool
 */
const retrieveDocumentsInputSchema = z.object({
    collection: z.string().describe('The name of the MongoDB collection to query'),
    query: z.record(z.any()).describe('The query filter object (MongoDB query syntax)'),
    limit: z.number().min(1).max(1000).optional().default(10).describe('Maximum number of documents to return (1-1000)'),
});
/**
 * Tool for retrieving multiple documents from a MongoDB collection
 */
export class RetrieveDocumentsTool extends BaseTool {
    constructor(documentService) {
        super();
        this.name = 'retrieve_documents';
        this.description = 'Retrieve documents from a MongoDB collection based on a query filter';
        this.inputSchema = retrieveDocumentsInputSchema;
        this.documentService = documentService;
    }
    /**
     * Execute the tool logic
     */
    async run(input) {
        const { collection, query, limit = 10 } = input;
        try {
            const documents = await this.documentService.findDocuments(collection, query, limit);
            if (documents.length === 0) {
                return this.createSuccessResponse('No documents found matching the query.');
            }
            return this.createSuccessResponse(documents);
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=RetrieveDocumentsTool.js.map