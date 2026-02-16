import { useCaseRepository } from '../repositories/use-case.repository.js';
import type { UpdateUseCaseRequestDto, UpdateUseCaseResponseDto } from '../use-case.dto.js';
import { NotFoundError } from '../../../core/errors/app.error.js';

/**
 * Update Use Case Handler
 * Merges partial updates onto an existing use case
 */
export class UpdateUseCaseHandler {
    async execute(id: string, dto: UpdateUseCaseRequestDto, userId?: string): Promise<UpdateUseCaseResponseDto> {
        // Fetch existing use case
        const existing = await useCaseRepository.findById(id);
        if (!existing) {
            throw new NotFoundError(`Use case with ID ${id} not found`);
        }

        // Shallow merge DTO fields onto existing use case
        const merged = {
            ...existing,
            ...dto,
            audit: {
                createdAt: existing.audit?.createdAt || new Date(),
                createdBy: existing.audit?.createdBy || 'system',
                updatedAt: new Date(),
                updatedBy: userId || existing.audit?.updatedBy || 'system',
            },
        };

        // Remove _id from merged to avoid conflicts (repository adds it back)
        delete (merged as any)._id;

        // Update in database
        await useCaseRepository.update(id, merged as any);

        return {
            id,
            key: existing.key,
            message: 'Use case updated successfully',
        };
    }
}

// Export singleton instance
export const updateUseCaseHandler = new UpdateUseCaseHandler();
