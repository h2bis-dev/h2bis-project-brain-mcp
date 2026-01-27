import { LLMService } from '../../services/llm/llm.service.js';
import type { UseCaseGenerationInput, UseCaseGenerationResult } from './types/use-case-generation.types.js';
import { USE_CASE_GENERATION_SYSTEM_PROMPT } from './prompts/system-prompt.js';
import { createUserPrompt } from './prompts/user-prompt.template.js';
import { logger } from '../../utils/logger.js';
import type { UseCase } from '../../agents/intent-extraction/types/intent-analysis.types.js';

export class UseCaseGenerationAgent {
    private llmService: LLMService;

    constructor() {
        this.llmService = new LLMService();
    }

    async generate(input: UseCaseGenerationInput): Promise<UseCaseGenerationResult> {
        logger.info('Generating Use Case', {
            hasDescription: !!input.description,
            hasExistingData: !!input.existingData
        });

        const systemPrompt = USE_CASE_GENERATION_SYSTEM_PROMPT;
        const userPromptContent = createUserPrompt(input);

        const messages = [
            { role: 'system' as const, content: systemPrompt },
            { role: 'user' as const, content: userPromptContent }
        ];

        try {
            const generatedUseCase = await this.llmService.chatJSON<Partial<UseCase>>(messages);

            // Basic post-processing / filling defaults if needed
            // For now, trust the LLM's adherence to schema

            return {
                useCase: generatedUseCase,
                generatedFields: Object.keys(generatedUseCase),
                confidence: 0.9 // Placeholder, could be derived from LLM metadata if available
            };

        } catch (error) {
            logger.error('Use Case Generation failed', { error });
            throw error;
        }
    }
}
