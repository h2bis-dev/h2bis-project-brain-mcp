import { useCaseRepository } from '../repositories/use-case.repository.js';
import { NotFoundError } from '../../../core/errors/app.error.js';
import { getDb } from '../../../core/database/connection.js';
import type { UseCaseDetailResponseDto } from '../use-case.dto.js';

/**
 * Get Use Case By ID Handler
 * Retrieves a single use case by its ID
 */
export class GetUseCaseByIdHandler {
    async execute(id: string): Promise<UseCaseDetailResponseDto> {
        // DEBUG: Fetch raw document from DB to see projectId
        const db = await getDb();
        const rawDoc = await db.collection('use_cases').findOne({ _id: id } as any);
        console.log('DEBUG raw document projectId:', rawDoc?.projectId);
        
        // Fetch use case from repository
        const useCase = await useCaseRepository.findById(id);

        if (!useCase) {
            throw new NotFoundError(`Use case with ID ${id} not found`);
        }

        // Debug: log what we got from repository
        console.log('DEBUG useCase projectId:', useCase.projectId);
        console.log('DEBUG useCase projectId (raw cast):', (useCase as any).projectId);
        console.log('DEBUG useCase keys:', Object.keys(useCase).slice(0, 10));

        // Transform to detailed response DTO
        return {
            id: useCase._id?.toString() || useCase.key,
            key: useCase.key,
            projectId: rawDoc?.projectId || (useCase as any).projectId || useCase.projectId,
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
