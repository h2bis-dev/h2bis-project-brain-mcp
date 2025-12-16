import { z } from 'zod';
/**
 * Zod schemas for MCP tool inputs
 */
export const retrieveDocumentSchema = z.object({
    collection: z.string().describe('MongoDB collection name'),
    query: z.record(z.any()).describe('MongoDB query filter'),
});
export const retrieveDocumentsSchema = z.object({
    collection: z.string().describe('MongoDB collection name'),
    query: z.record(z.any()).describe('MongoDB query filter'),
    limit: z.number().min(1).max(100).optional().default(10).describe('Maximum documents to return'),
});
//# sourceMappingURL=schemas.js.map