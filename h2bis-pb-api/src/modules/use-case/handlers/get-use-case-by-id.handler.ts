import { useCaseRepository } from '../repositories/use-case.repository.js';
import { NotFoundError } from '../../../core/errors/app.error.js';
import type { UseCaseDetailResponseDto } from '../use-case.dto.js';

/**
 * Get Use Case By ID Handler
 * Retrieves a single use case by its ID
 */
export class GetUseCaseByIdHandler {
    async execute(id: string): Promise<UseCaseDetailResponseDto> {
        // Fetch use case from repository
        const useCase = await useCaseRepository.findById(id);

        if (!useCase) {
            throw new NotFoundError(`Use case with ID ${id} not found`);
        }

        // Transform to detailed response DTO
        return {
            id: useCase._id?.toString() || useCase.key,
            key: useCase.key,
            name: useCase.name,
            description: useCase.description,
            status: {
                lifecycle: useCase.status.lifecycle,
                reviewedByHuman: useCase.status.reviewedByHuman,
                generatedByAI: useCase.status.generatedByAI
            },
            businessValue: useCase.businessValue,
            primaryActor: useCase.primaryActor,
            acceptanceCriteria: useCase.acceptanceCriteria || [],
            flows: useCase.flows || [],
            technicalSurface: useCase.technicalSurface,
            relationships: useCase.relationships || [],
            implementationRisk: useCase.implementationRisk || [],
            tags: useCase.tags || [],
            normative: useCase.normative || false,
            aiMetadata: useCase.aiMetadata,
            audit: useCase.audit
        };
    }
}

// Export singleton instance
export const getUseCaseByIdHandler = new GetUseCaseByIdHandler();
