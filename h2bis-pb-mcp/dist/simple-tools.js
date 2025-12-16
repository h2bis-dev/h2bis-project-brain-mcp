import { z } from 'zod';
import { mongoose } from './simple-database.js';
// Tool schemas
const retrieveDocumentSchema = z.object({
    collection: z.string(),
    query: z.record(z.any()),
});
const retrieveDocumentsSchema = z.object({
    collection: z.string(),
    query: z.record(z.any()),
    limit: z.number().min(1).max(100).optional().default(10),
});
// Tool handlers
async function retrieveDocument(input) {
    const { collection, query } = retrieveDocumentSchema.parse(input);
    console.error(`🔍 Retrieving document from ${collection}:`, query);
    const db = mongoose.connection.db;
    const doc = await db.collection(collection).findOne(query);
    if (!doc) {
        return {
            content: [{ type: 'text', text: 'No document found.' }]
        };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(doc, null, 2) }]
    };
}
async function retrieveDocuments(input) {
    const { collection, query, limit } = retrieveDocumentsSchema.parse(input);
    console.error(`🔍 Retrieving documents from ${collection}:`, query, `limit:`, limit);
    const db = mongoose.connection.db;
    const docs = await db.collection(collection).find(query).limit(limit).toArray();
    if (docs.length === 0) {
        return {
            content: [{ type: 'text', text: 'No documents found.' }]
        };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }]
    };
}
// Helper to convert Zod to JSON Schema
function zodToJsonSchema(schema) {
    const shape = schema._def.shape();
    const properties = {};
    const required = [];
    for (const [key, value] of Object.entries(shape)) {
        const zodType = value;
        if (zodType instanceof z.ZodString) {
            properties[key] = { type: 'string' };
        }
        else if (zodType instanceof z.ZodNumber) {
            properties[key] = { type: 'number' };
        }
        else if (zodType instanceof z.ZodRecord) {
            properties[key] = { type: 'object' };
        }
        else if (zodType instanceof z.ZodOptional || zodType instanceof z.ZodDefault) {
            properties[key] = { type: 'number' };
        }
        else {
            properties[key] = { type: 'string' };
        }
        if (!zodType.isOptional()) {
            required.push(key);
        }
    }
    return {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined,
    };
}
// Export tools
export const tools = [
    {
        name: 'retrieve_document',
        description: 'Retrieve a single document from MongoDB collection',
        inputSchema: zodToJsonSchema(retrieveDocumentSchema),
        handler: retrieveDocument,
    },
    {
        name: 'retrieve_documents',
        description: 'Retrieve multiple documents from MongoDB collection',
        inputSchema: zodToJsonSchema(retrieveDocumentsSchema),
        handler: retrieveDocuments,
    },
];
//# sourceMappingURL=simple-tools.js.map