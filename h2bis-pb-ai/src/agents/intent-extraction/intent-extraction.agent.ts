import { LLMService } from '../../core/services/llm/llm.service.js';
import { CacheService } from '../../core/services/cache/cache.service.js';
import { IntentAnalysis, UseCase, ValidationResult } from './types/intent-analysis.types.js';
import { INTENT_EXTRACTION_SYSTEM_PROMPT, INTENT_EXTRACTION_STRICT_SYSTEM_PROMPT } from './prompts/system-prompt.js';
import { createUserPrompt } from './prompts/user-prompt.template.js';
import { validateIntentExtraction } from '../../core/utils/validators.js';
import { logger } from '../../core/utils/logger.js';
import { config } from '../../core/config/config.js';
import { PROMPT_VERSION } from '../../core/config/prompts.config.js';

export class IntentExtractionAgent {
    private llmService: LLMService;
    private cacheService: CacheService;

    constructor() {
        this.llmService = new LLMService();
        this.cacheService = new CacheService();
    }

    async extractIntent(useCase: UseCase, options?: { strictMode?: boolean; validationFeedback?: string[] }): Promise<IntentAnalysis> {
        const strictMode = options?.strictMode || false;
        const validationFeedback = options?.validationFeedback;

        // Check cache first (but not if we have feedback from retries)
        if (config.cache.enabled && !validationFeedback) {
            const cached = await this.getCachedIntent(useCase.key);
            if (cached) {
                logger.info('Intent extraction cache hit', { useCaseKey: useCase.key });
                return cached;
            }
        }

        // Extract with retry (pass strict mode and validation feedback)
        const analysis = await this.extractWithRetry(useCase, 3, strictMode, validationFeedback);

        // Cache result
        if (config.cache.enabled) {
            await this.cacheIntent(useCase.key, analysis);
        }

        return analysis;
    }


    private async extractWithRetry(
        useCase: UseCase,
        maxRetries: number,
        strictMode: boolean,
        validationFeedback?: string[]
    ): Promise<IntentAnalysis> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.info('Extracting intent', { useCaseKey: useCase.key, attempt, strictMode, hasFeedback: !!validationFeedback });

                // Call LLM

                //  -------------- Two Separate "contents" --------------

                //   Role	     |   Purpose	           |       Analogy
                // ____________  |_______________________  |_________________________
                //   "system"    |  Sets context & rules   |  "You are a doctor..."
                //   "user"      |  Asks the question	   |  "I have a headache, what should I do?"

                // Use strict prompt if in normative mode
                const systemPrompt = strictMode
                    ? INTENT_EXTRACTION_STRICT_SYSTEM_PROMPT
                    : INTENT_EXTRACTION_SYSTEM_PROMPT;

                // Build user prompt with validation feedback if available
                let userPromptContent = createUserPrompt(useCase);

                if (validationFeedback && validationFeedback.length > 0) {
                    userPromptContent += `\n\n## PREVIOUS VALIDATION ERRORS - MUST FIX\n\n` +
                        `The previous transformation attempt was rejected due to the following issues. ` +
                        `You MUST address these specific problems in this attempt:\n\n` +
                        validationFeedback.map((f, i) => `${i + 1}. ${f}`).join('\n') +
                        `\n\n**CRITICAL**: Pay special attention to these errors and ensure they do not occur again.`;
                }

                const messages = [
                    { role: 'system' as const, content: systemPrompt },
                    { role: 'user' as const, content: userPromptContent }
                ];

                const rawAnalysis = await this.llmService.chatJSON<Omit<IntentAnalysis, 'extractedAt' | 'llmModel' | 'promptVersion'>>(messages);

                // Add metadata
                const analysis: IntentAnalysis = {
                    ...rawAnalysis,
                    extractedAt: new Date(),
                    llmModel: config.llm.model,
                    promptVersion: PROMPT_VERSION.intentExtraction
                };

                // Validate
                const validation = await this.validateExtraction(analysis, useCase);

                if (!validation.valid) {
                    if (validation.recommendation === 'retry' && attempt < maxRetries) {
                        logger.warn('Validation failed, retrying', {
                            useCaseKey: useCase.key,
                            issues: validation.criticalIssues
                        });
                        continue;
                    }

                    if (validation.recommendation === 'manual_review') {
                        logger.warn('Manual review required', {
                            useCaseKey: useCase.key,
                            issues: validation.criticalIssues
                        });
                        // Return with warnings
                    }
                }

                if (validation.warnings.length > 0) {
                    logger.warn('Intent extraction completed with warnings', {
                        useCaseKey: useCase.key,
                        warnings: validation.warnings
                    });
                }

                logger.info('Intent extraction successful', {
                    useCaseKey: useCase.key,
                    confidence: analysis.confidenceLevel
                });

                return analysis;
            } catch (error) {
                lastError = error as Error;
                logger.error('Intent extraction failed', {
                    useCaseKey: useCase.key,
                    attempt,
                    error: lastError.message
                });

                if (attempt === maxRetries) {
                    throw lastError;
                }

                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }

        throw lastError!;
    }

    async validateExtraction(analysis: IntentAnalysis, useCase: UseCase): Promise<ValidationResult> {
        return validateIntentExtraction(analysis, useCase);
    }

    async getCachedIntent(useCaseKey: string): Promise<IntentAnalysis | null> {
        return this.cacheService.get<IntentAnalysis>(`intent:${useCaseKey}`);
    }

    async cacheIntent(useCaseKey: string, analysis: IntentAnalysis): Promise<void> {
        await this.cacheService.set(`intent:${useCaseKey}`, analysis, config.cache.ttl);
    }
}
