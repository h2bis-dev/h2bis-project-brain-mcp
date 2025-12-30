import { LLMService } from '../../services/llm/llm.service.js';
import { CacheService } from '../../services/cache/cache.service.js';
import { IntentAnalysis, UseCase, ValidationResult } from './types/intent-analysis.types.js';
import { INTENT_EXTRACTION_SYSTEM_PROMPT } from './prompts/system-prompt.js';
import { createUserPrompt } from './prompts/user-prompt.template.js';
import { validateIntentExtraction } from '../../utils/validators.js';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/config.js';
import { PROMPT_VERSION } from '../../config/prompts.config.js';

export class IntentExtractionAgent {
    private llmService: LLMService;
    private cacheService: CacheService;

    constructor() {
        this.llmService = new LLMService();
        this.cacheService = new CacheService();
    }

    async extractIntent(useCase: UseCase): Promise<IntentAnalysis> {
        // Check cache first
        if (config.cache.enabled) {
            const cached = await this.getCachedIntent(useCase.key);
            if (cached) {
                logger.info('Intent extraction cache hit', { useCaseKey: useCase.key });
                return cached;
            }
        }

        // Extract with retry
        const analysis = await this.extractWithRetry(useCase, 3);

        // Cache result
        if (config.cache.enabled) {
            await this.cacheIntent(useCase.key, analysis);
        }

        return analysis;
    }

    private async extractWithRetry(useCase: UseCase, maxRetries: number): Promise<IntentAnalysis> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                logger.info('Extracting intent', { useCaseKey: useCase.key, attempt });

                // Call LLM

                //  -------------- Two Separate "contents" --------------

                //   Role	     |   Purpose	           |       Analogy
                // ____________  |_______________________  |_________________________
                //   "system"    |  Sets context & rules   |  "You are a doctor..."
                //   "user"      |  Asks the question	   |  "I have a headache, what should I do?"
        
                const messages = [
                    { role: 'system' as const, content: INTENT_EXTRACTION_SYSTEM_PROMPT },
                    { role: 'user' as const, content: createUserPrompt(useCase) }
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
