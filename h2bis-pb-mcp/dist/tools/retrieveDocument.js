import { z } from 'zod';
import { DatabaseService } from '../services/databaseService.js';
export const retrieveDocumentSchema = z.object({
    collection: z.string().describe('The name of the MongoDB collection to query'),
    query: z.record(z.any()).describe('The query filter object (MongoDB query syntax) to find a single document')
});
export const retrieveDocumentTool = {
    name: 'retrieve_document',
    description: 'Retrieve a single document from a MongoDB collection based on a query filter',
    inputSchema: retrieveDocumentSchema,
    handler: async (args) => {
        try {
            const { collection, query } = args;
            const document = await DatabaseService.findOneDocument(collection, query);
            if (!document) {
                return {
                    content: [{ type: 'text', text: 'No document found matching the query.' }]
                };
            }
            return {
                content: [{ type: 'text', text: JSON.stringify(document, null, 2) }]
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [{ type: 'text', text: `Error retrieving document: ${message}` }],
                isError: true
            };
        }
    }
};
//# sourceMappingURL=retrieveDocument.js.map