import { z } from 'zod';
import { EntitySchema } from '../../domain/schemas/entity_schema.js';

// ==================== Request DTOs ====================

export const InsertDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    document: z.record(z.any()) // Will be validated against EntitySchema separately
});

export type InsertDocumentRequestDto = z.infer<typeof InsertDocumentRequestDto>;

export const FindDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()).optional().default({})
});

export type FindDocumentRequestDto = z.infer<typeof FindDocumentRequestDto>;

export const UpdateDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any()),
    document: z.record(z.any()) // Will be validated against EntitySchema separately
});

export type UpdateDocumentRequestDto = z.infer<typeof UpdateDocumentRequestDto>;

export const DeleteDocumentRequestDto = z.object({
    collectionName: z.string().min(1, 'Collection name is required'),
    filter: z.record(z.any())
});

export type DeleteDocumentRequestDto = z.infer<typeof DeleteDocumentRequestDto>;

// ==================== Response DTOs ====================

export interface InsertDocumentResponseDto {
    insertedId: string;
    capabilityGenerated: boolean;
    capabilityId?: string | null;
    mode?: string;
    insufficiencyReport?: any;
    validationReport?: any;
}

export interface FindDocumentResponseDto {
    document: any | null;
}

export interface UpdateDocumentResponseDto {
    matchedCount: number;
    modifiedCount: number;
    capabilityUpdated: boolean;
}

export interface DeleteDocumentResponseDto {
    deletedCount: number;
    capabilitiesDeleted: number;
}

export interface ListCollectionsResponseDto {
    collections: string[];
}
