import { DocumentService } from '../services/index.js';
import { retrieveDocumentsSchema } from './schemas.js';
import { zodToJsonSchema } from './utils.js';
const documentService = new DocumentService();
/**
 * Retrieve multiple documents from MongoDB
 */
export async function retrieveDocuments(args) {
    const { collection, query, limit } = retrieveDocumentsSchema.parse(args);
    const docs = await documentService.findMany(collection, query, limit);
    return {
        content: [{
                type: 'text',
                text: docs.length > 0 ? JSON.stringify(docs, null, 2) : 'No documents found'
            }]
    };
}
/**
 * Tool definition for retrieve_documents
 */
export const retrieveDocumentsTool = {
    name: 'retrieve_documents',
    description: 'Retrieve multiple documents from MongoDB collection',
    inputSchema: zodToJsonSchema(retrieveDocumentsSchema),
    handler: retrieveDocuments,
};
//# sourceMappingURL=retrieve-documents.js.map