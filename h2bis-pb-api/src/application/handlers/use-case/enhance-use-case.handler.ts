import type { UseCase } from '../../../domain/schemas/use_case_schema.js';
import { UseCaseGenerationAgent } from 'h2bis-pb-ai';
import type { UseCaseGenerationInput } from 'h2bis-pb-ai';
import type { EnhanceUseCaseRequestDto, EnhanceUseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';
import { useCaseRepository } from '../../../infrastructure/database/repositories/use-case.repository.js';
import { NotFoundError } from '../../../shared/errors/app.error.js';

/**
 * Enhance Use Case Handler
 * Uses AI to improve/fill fields of an existing use case
 * Reuses the same UseCaseGenerationAgent with existingData context
 */
export class EnhanceUseCaseHandler {
    private agent: UseCaseGenerationAgent;

    constructor() {
        this.agent = new UseCaseGenerationAgent();
    }

    async execute(dto: EnhanceUseCaseRequestDto): Promise<EnhanceUseCaseResponseDto> {
        // Fetch existing use case
        const existing = await useCaseRepository.findById(dto.useCaseId);
        if (!existing) {
            throw new NotFoundError(`Use case with ID ${dto.useCaseId} not found`);
        }

        // Build description from user instructions + context about what to enhance
        let description = dto.instructions;
        if (dto.fieldsToEnhance && dto.fieldsToEnhance.length > 0) {
            description += `\n\nFocus on enhancing these specific fields: ${dto.fieldsToEnhance.join(', ')}`;
        }

        // Strip _id and audit from existingData to keep AI input clean
        const { _id, audit, ...existingData } = existing as any;

        const input: UseCaseGenerationInput = {
            description,
            existingData,
        };

        console.log(`[EnhanceUseCaseHandler] Enhancing use case: ${existing.key}`);
        console.log(`[EnhanceUseCaseHandler] Instructions: ${dto.instructions.substring(0, 200)}...`);

        const result = await this.agent.generate(input);

        return {
            useCase: result.useCase as unknown as Partial<UseCase>,
            enhancedFields: result.generatedFields,
            confidence: result.confidence,
        };
    }
}

// Export singleton instance
export const enhanceUseCaseHandler = new EnhanceUseCaseHandler();
