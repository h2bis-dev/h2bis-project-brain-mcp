
import { UseCaseGenerationAgent } from 'h2bis-pb-ai';
import type { GenerateUseCaseRequestDto, GenerateUseCaseResponseDto } from '../../../api/dtos/use-case.dto.js';
import type { UseCaseGenerationInput } from 'h2bis-pb-ai';
import * as fs from 'fs';
import * as path from 'path';

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
        try {
            const input: UseCaseGenerationInput = {
                description: dto.description,
                existingData: dto.existingData
            };

            console.log(`[GenerateUseCaseHandler] Input Description Length: ${input.description?.length}`);
            console.log(`[GenerateUseCaseHandler] Input Description Preview: ${input.description?.substring(0, 200)}...`);

            const result = await this.agent.generate(input);

            return {
                useCase: result.useCase,
                generatedFields: result.generatedFields,
                confidence: result.confidence
            };
        } catch (error: any) {
            const logPath = path.join(process.cwd(), 'debug_error.log');
            const errorMessage = `[${new Date().toISOString()}] Error in GenerateUseCaseHandler: ${error.message}\nStack: ${error.stack}\nDetails: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\n\n`;

            // Try to write to a file in the project root
            try {
                fs.appendFileSync(logPath, errorMessage);
            } catch (fsError) {
                console.error("Failed to write to debug log:", fsError);
            }

            console.error("GenerateUseCaseHandler failed:", error);
            throw error;
        }
    }
}

// Export singleton instance
export const generateUseCaseHandler = new GenerateUseCaseHandler();
