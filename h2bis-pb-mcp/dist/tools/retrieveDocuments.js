import { z } from 'zod';
import { DatabaseService } from '../services/databaseService.js';
export const retrieveDocumentsSchema = z.object({
    collection: z.string().describe('The name of the MongoDB collection to query'),
    query: z.record(z.any()).describe('The query filter object (MongoDB query syntax)'),
    limit: z.number().optional().default(10).describe('Maximum number of documents to return')
});
export const retrieveDocumentsTool = {
    name: 'retrieve_documents',
    description: 'Retrieve documents from a MongoDB collection based on a query filter',
    inputSchema: retrieveDocumentsSchema,
    handler: async (args) => {
        try {
            const { collection, query, limit = 10 } = args;
            const documents = await DatabaseService.findDocuments(collection, query, limit);
            return {
                content: [{ type: 'text', text: JSON.stringify(documents, null, 2) }]
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{ type: 'text', text: `Error retrieving documents: ${message}` }],
                isError: true
            };
        }
    }
};
//# sourceMappingURL=retrieveDocuments.js.map