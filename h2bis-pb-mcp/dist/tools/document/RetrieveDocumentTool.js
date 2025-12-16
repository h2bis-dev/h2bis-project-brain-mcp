import { z } from 'zod';
import { BaseTool } from '../base/BaseTool.js';
/**
 * Input schema for retrieve_document tool
 */
export const retrieveDocumentInputSchema = z.object({
    collection: z.string().describe('The name of the MongoDB collection to query'),
    query: z.record(z.any()).describe('The query filter object (MongoDB query syntax) to find a single document'),
});
/**
 * Tool for retrieving a single document from a MongoDB collection
 */
export class RetrieveDocumentTool extends BaseTool {
    constructor(documentService) {
        super();
        this.name = 'retrieve_document';
        this.description = 'Retrieve a single document from a MongoDB collection based on a query filter';
        this.inputSchema = retrieveDocumentInputSchema;
        this.documentService = documentService;
    }
    /**
     * Execute the tool logic
     */
    async run(input) {
        const { collection, query } = input;
        try {
            const document = await this.documentService.findOneDocument(collection, query);
            if (!document) {
                return this.createSuccessResponse('No document found matching the query.');
            }
            return this.createSuccessResponse(document);
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=RetrieveDocumentTool.js.map