import { useCaseRepository } from '../../../infrastructure/database/repositories/use-case.repository.js';
import type { UseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';

/**
 * Get All Use Cases Handler
 * Retrieves all use cases from the database
 */
export class GetUseCasesHandler {
    async execute(): Promise<UseCaseResponseDto[]> {
        // Fetch all use cases from repository
        const useCases = await useCaseRepository.findAll();

        // Transform to response DTOs (return summary fields only)
        return useCases.map(uc => ({
            id: uc._id?.toString() || uc.key,
            key: uc.key,
            name: uc.name,
            description: uc.description,
            status: {
                lifecycle: uc.status.lifecycle,
                reviewedByHuman: uc.status.reviewedByHuman,
                generatedByAI: uc.status.generatedByAI
            },
            businessValue: uc.businessValue,
            primaryActor: uc.primaryActor,
            tags: uc.tags || [],
            aiMetadata: uc.aiMetadata ? {
                estimatedComplexity: uc.aiMetadata.estimatedComplexity
            } : undefined
        }));
    }
}

// Export singleton instance
export const getUseCasesHandler = new GetUseCasesHandler();
