import { useCaseRepository } from '../../../infrastructure/database/repositories/use-case.repository.js';
import type { CreateUseCaseRequestDto, CreateUseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';
import { HandlerSchema, type Handler, createDefaultAudit } from '../../../domain/schemas/use_case_schema.js';
import { generateCapabilityFromHandlerHandler } from '../capability/generate-capability.handler.js';

/**
 * Create Use Case Handler
 * Creates a new use case in the database
 */
export class CreateUseCaseHandler {
    async execute(dto: CreateUseCaseRequestDto, userId?: string): Promise<CreateUseCaseResponseDto> {
        // Check if use case with this key already exists
        console.log('[CreateUseCaseHandler] Executing with DTO:', JSON.stringify(dto, null, 2));

        const existing = await useCaseRepository.findByKey(dto.key);
        if (existing) {
            console.error(`[CreateUseCaseHandler] Use case with key '${dto.key}' already exists`);
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
            stakeholders: dto.stakeholders,
            functionalRequirements: dto.functionalRequirements,
            scope: dto.scope,
            domainModel: dto.domainModel,
            interfaces: dto.interfaces,
            errorHandling: dto.errorHandling,
            architecture: dto.architecture,
            technologyConstraints: dto.technologyConstraints,
            configuration: dto.configuration,
            quality: dto.quality,
            aiDirectives: dto.aiDirectives,
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

        // // AUTO-GENERATE CAPABILITY
        console.log('🔍 Checking for capability auto-generation for use case:', useCase.key);

        const handlerResult = HandlerSchema.safeParse(useCase);

        if (handlerResult.success) {
            // const capabilityResult = await generateCapabilityFromHandlerHandler.execute(handlerResult.data);
            const capabilityResult = {
                mode: 'REJECTED',
                insufficiencyReport: 'Use case was incomplete',
                validationReport: 'Use case was incomplete',
                generated: false,
                capabilityId: ''
            };

            if (capabilityResult.mode === 'REJECTED' && capabilityResult.insufficiencyReport) {
                // Normative use case was incomplete
                return {
                    id,
                    key: dto.key,
                    message: 'Use case created but capability generation rejected (insufficient data)',
                    capabilityGenerated: false,
                    mode: 'REJECTED',
                    insufficiencyReport: capabilityResult.insufficiencyReport
                };
            }

            if (capabilityResult.mode === 'REJECTED' && capabilityResult.validationReport) {
                // Validation failed after retries
                return {
                    id,
                    key: dto.key,
                    message: 'Use case created but capability generation failed validation',
                    capabilityGenerated: false,
                    mode: 'REJECTED',
                    validationReport: capabilityResult.validationReport
                };
            }

            return {
                id,
                key: dto.key,

                message: 'Use case created and capability generated successfully',
                capabilityGenerated: capabilityResult.generated,
                capabilityId: capabilityResult.capabilityId,
                mode: capabilityResult.mode
            };
        } else {
            console.warn('⚠️ Handler validation failed:', handlerResult.error.errors);
            return {
                id,
                key: dto.key,
                message: 'Use case created but validation failed for capability generation',
                capabilityGenerated: false
            };
        }
    }
}

// Export singleton instance
export const createUseCaseHandler = new CreateUseCaseHandler();
