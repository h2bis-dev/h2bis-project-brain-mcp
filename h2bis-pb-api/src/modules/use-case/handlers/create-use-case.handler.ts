import { useCaseRepository } from '../repositories/use-case.repository.js';
import type { CreateUseCaseRequestDto, CreateUseCaseResponseDto } from '../use-case.dto.js';
import { UseCaseSchema, type UseCase, createUseCase } from '../../../core/schemas/use_case_schema.js';
import { generateCapabilityFromHandlerHandler } from '../../capability/handlers/generate-capability.handler.js';
import { ConflictError } from '../../../core/errors/app.error.js';

/**
 * Create Use Case Handler
 * Creates a new use case in the database
 */
export class CreateUseCaseHandler {
    async execute(dto: CreateUseCaseRequestDto, userId?: string): Promise<CreateUseCaseResponseDto> {
        // Check if use case with this key already exists

        const existing = await useCaseRepository.findByKey(dto.key);
        if (existing) {
            console.error(`[CreateUseCaseHandler] Use case with key '${dto.key}' already exists`);
            throw new ConflictError(`Use case with key '${dto.key}' already exists. Please use a different key or update the existing use case.`);
        }

        // Build use case object
        const useCase = createUseCase(dto, userId);

        // Create the use case
        const id = await useCaseRepository.create(useCase);

        // // AUTO-GENERATE CAPABILITY
        console.log('🔍 Checking for capability auto-generation for use case:', useCase.key);

        const handlerResult = UseCaseSchema.safeParse(useCase);

        if (handlerResult.success) {
            /* CAPABILITY GENERATION - UNCOMMENT TO ENABLE
        const capabilityResult = await generateCapabilityFromHandlerHandler.execute(handlerResult.data);

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
        */

            return {
                id,
                key: dto.key,
                message: 'Use case created successfully (capability generation skipped)',
                capabilityGenerated: false
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
