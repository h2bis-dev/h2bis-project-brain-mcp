import { useCaseRepository } from '../repositories/use-case.repository.js';
import type { UseCaseResponseDto } from '../use-case.dto.js';

/**
 * Get All Use Cases Handler
 * Retrieves all use cases from the database
 */
export class GetUseCasesHandler {
    async execute(projectId?: string): Promise<UseCaseResponseDto[]> {
        // Fetch use cases from repository - filter by project if provided
        const useCases = projectId
            ? await useCaseRepository.findByProjectId(projectId)
            : await useCaseRepository.findAll();

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
