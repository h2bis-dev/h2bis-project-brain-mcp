import type { UseCase } from '../../../core/schemas/use_case_schema.js';
import { UseCaseGenerationAgent } from 'h2bis-pb-ai';
import type { GenerateUseCaseRequestDto, GenerateUseCaseResponseDto } from '../use-case.dto.js';
import type { UseCaseGenerationInput } from 'h2bis-pb-ai';
import { projectRepository } from '../../project/repositories/project.repository.js';
import { buildProjectContext } from './project-context.utils.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate Use Case Handler
 * Generates a use case structure from a text description using AI,
 * enriched with project-level context (tech stack, architecture, API registry, domain catalog).
 */
export class GenerateUseCaseHandler {
    private agent: UseCaseGenerationAgent;

    constructor() {
        this.agent = new UseCaseGenerationAgent();
    }

    async execute(dto: GenerateUseCaseRequestDto): Promise<GenerateUseCaseResponseDto> {
        try {
            // Fetch project context if a projectId was provided
            let projectContext = undefined;
            if (dto.projectId) {
                const project = await projectRepository.findById(dto.projectId);
                if (project) {
                    projectContext = buildProjectContext(project);
                    console.log(`[GenerateUseCaseHandler] Project context loaded for: ${(project as any).name}`);
                }
            }

            const input: UseCaseGenerationInput = {
                description: dto.description,
                existingData: dto.existingData,
                projectContext
            };

            console.log(`[GenerateUseCaseHandler] Input Description Length: ${input.description?.length}`);
            console.log(`[GenerateUseCaseHandler] Input Description Preview: ${input.description?.substring(0, 200)}...`);

            const result = await this.agent.generate(input);

            return {
                useCase: result.useCase as unknown as Partial<UseCase>,
                generatedFields: result.generatedFields,
                confidence: result.confidence
            };
        } catch (error: any) {
            const logPath = path.join(process.cwd(), 'debug_error.log');
            const errorMessage = `[${new Date().toISOString()}] Error in GenerateUseCaseHandler: ${error.message}\nStack: ${error.stack}\nDetails: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}\n\n`;

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

