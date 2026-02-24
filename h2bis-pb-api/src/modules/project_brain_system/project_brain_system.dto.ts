import { z } from 'zod';

// ==================== Request DTOs ====================

/**
 * List Collections Request DTO
 */
export const ListCollectionsRequestDto = z.object({
    includeSystem: z.boolean().optional().describe('Include system collections')
});

/**
 * Find Document Request DTO
 */
export const FindDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()).optional().describe('MongoDB query filter'),
    limit: z.number().int().positive().optional().describe('Maximum number of documents to return'),
    skip: z.number().int().nonnegative().optional().describe('Number of documents to skip')
});

/**
 * Insert Document Request DTO
 */
export const InsertDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    document: z.record(z.any()).describe('Document to insert')
});

/**
 * Update Document Request DTO
 */
export const UpdateDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()).describe('MongoDB query filter to find document'),
    update: z.record(z.any()).describe('Update operations')
});

/**
 * Delete Document Request DTO
 */
export const DeleteDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()).describe('MongoDB query filter to find document')
});

// ==================== Response DTOs ====================

/**
 * Collections Response DTO
 */
export type CollectionsResponseDto = {
    collections: string[];
    total: number;
};

/**
 * Documents Response DTO
 */
export type DocumentsResponseDto = {
    documents: any[];
    total: number;
    collectionName: string;
};

/**
 * Document Operation Response DTO
 */
export type DocumentOperationResponseDto = {
    success: boolean;
    documentId?: string;
    modifiedCount?: number;
    deletedCount?: number;
    message?: string;
};

// ==================== Type Exports ====================

export type ListCollectionsRequest = z.infer<typeof ListCollectionsRequestDto>;
export type FindDocumentRequest = z.infer<typeof FindDocumentRequestDto>;
export type InsertDocumentRequest = z.infer<typeof InsertDocumentRequestDto>;
export type UpdateDocumentRequest = z.infer<typeof UpdateDocumentRequestDto>;
export type DeleteDocumentRequest = z.infer<typeof DeleteDocumentRequestDto>;
