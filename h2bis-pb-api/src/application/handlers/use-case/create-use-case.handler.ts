import { useCaseRepository } from '../../../infrastructure/database/repositories/use-case.repository.js';
import type { CreateUseCaseRequestDto, CreateUseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';
import type { Handler } from '../../../domain/schemas/use_case_schema.js';
import { createDefaultAudit } from '../../../domain/schemas/use_case_schema.js';

/**
 * Create Use Case Handler
 * Creates a new use case in the database
 */
export class CreateUseCaseHandler {
    async execute(dto: CreateUseCaseRequestDto, userId?: string): Promise<CreateUseCaseResponseDto> {
        // Check if use case with this key already exists
        const existing = await useCaseRepository.findByKey(dto.key);
        if (existing) {
            throw new Error(`Use case with key '${dto.key}' already exists`);
        }

        // Build use case object
        const useCase: Handler = {
            type: 'use_case',
            key: dto.key,
            name: dto.name,
            description: dto.description,
            status: dto.status || {
                lifecycle: 'idea',
                reviewedByHuman: false,
                generatedByAI: false
            },
            businessValue: dto.businessValue,
            primaryActor: dto.primaryActor,
            acceptanceCriteria: dto.acceptanceCriteria || [],
            flows: dto.flows || [],
            technicalSurface: dto.technicalSurface,
            relationships: dto.relationships || [],
            implementationRisk: dto.implementationRisk || [],
            tags: dto.tags || [],
            normative: dto.normative || false,
            aiMetadata: dto.aiMetadata || {
                estimatedComplexity: 'medium',
                implementationRisk: [],
                testStrategy: [],
                nonFunctionalRequirements: []
            },
            audit: createDefaultAudit(userId || 'system')
        };

        // Create the use case
        const id = await useCaseRepository.create(useCase);

        return {
            id,
            key: dto.key,
            message: 'Use case created successfully'
        };
    }
}

// Export singleton instance
export const createUseCaseHandler = new CreateUseCaseHandler();
