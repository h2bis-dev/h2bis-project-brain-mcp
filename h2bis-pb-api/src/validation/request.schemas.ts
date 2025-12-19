import { z } from 'zod';

/**
 * Request validation schemas for API endpoints
 * These validate the HTTP request structure, not the entity data
 */

export const InsertDocumentRequestSchema = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    document: z.record(z.any()),
});

export const FindDocumentRequestSchema = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()).optional().default({}),
});

export const UpdateDocumentRequestSchema = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()),
    document: z.record(z.any()), // Changed from 'update' to 'document' for full replacement
});

export const DeleteDocumentRequestSchema = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()),
});

// Type exports for TypeScript
export type InsertDocumentRequest = z.infer<typeof InsertDocumentRequestSchema>;
export type FindDocumentRequest = z.infer<typeof FindDocumentRequestSchema>;
export type UpdateDocumentRequest = z.infer<typeof UpdateDocumentRequestSchema>;
export type DeleteDocumentRequest = z.infer<typeof DeleteDocumentRequestSchema>;
