import { UseCaseGenerationAgent } from 'h2bis-pb-ai';
import type { GenerateUseCaseRequestDto, GenerateUseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';
import type { UseCaseGenerationInput } from 'h2bis-pb-ai';

/**
 * Generate Use Case Handler
 * Generates a use case structure from a text description using AI
 */
export class GenerateUseCaseHandler {
    private agent: UseCaseGenerationAgent;

    constructor() {
        this.agent = new UseCaseGenerationAgent();
    }

    async execute(dto: GenerateUseCaseRequestDto): Promise<GenerateUseCaseResponseDto> {
        const input: UseCaseGenerationInput = {
            description: dto.description,
            existingData: dto.existingData
        };

        const result = await this.agent.generate(input);

        return {
            useCase: result.useCase,
            generatedFields: result.generatedFields,
            confidence: result.confidence
        };
    }
}

// Export singleton instance
export const generateUseCaseHandler = new GenerateUseCaseHandler();
