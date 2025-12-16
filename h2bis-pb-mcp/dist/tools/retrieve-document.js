import { DocumentService } from '../services/index.js';
import { retrieveDocumentSchema } from './schemas.js';
import { zodToJsonSchema } from './utils.js';
const documentService = new DocumentService();
/**
 * Retrieve a single document from MongoDB
 */
export async function retrieveDocument(args) {
    const { collection, query } = retrieveDocumentSchema.parse(args);
    const doc = await documentService.findOne(collection, query);
    return {
        content: [{
                type: 'text',
                text: doc ? JSON.stringify(doc, null, 2) : 'No document found'
            }]
    };
}
/**
 * Tool definition for retrieve_document
 */
export const retrieveDocumentTool = {
    name: 'retrieve_document',
    description: 'Retrieve a single document from MongoDB collection',
    inputSchema: zodToJsonSchema(retrieveDocumentSchema),
    handler: retrieveDocument,
};
//# sourceMappingURL=retrieve-document.js.map