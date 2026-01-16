import { z } from 'zod';
import { CapabilityNodeSchema } from '../../domain/schemas/capability_schema.js';

// ==================== Request DTOs ====================

export const CreateCapabilityRequestDto = CapabilityNodeSchema;
export type CreateCapabilityRequestDto = z.infer<typeof CreateCapabilityRequestDto>;

export const UpdateCapabilityRequestDto = CapabilityNodeSchema.partial();
export type UpdateCapabilityRequestDto = z.infer<typeof UpdateCapabilityRequestDto>;

// ==================== Response DTOs ====================

export interface CreateCapabilityResponseDto {
    id: string;
}

export interface GetCapabilityResponseDto {
    capability: any | null;
}

export interface UpdateCapabilityResponseDto {
    success: boolean;
}

export interface DeleteCapabilityResponseDto {
    deleted: boolean;
}
