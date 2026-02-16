import { LLMService } from '../../core/services/llm/llm.service.js';
import { logger } from '../../core/utils/logger.js';
import { config } from '../../core/config/config.js';
import { TRANSFORMATION_VALIDATION_SYSTEM_PROMPT } from './prompts/validation-prompt.js';

/**
 * Transformation Validation Agent
 * 
 * Uses LLM to validate that capability generation preserved intent
 * and did not invent information not present in the source use case.
 */

export interface ValidationInput {
    useCase: any;  // Original use case
    capability: any;  // Generated capability
    useCaseSchema: any;  // Schema for validation context
    capabilitySchema: any;  // Schema for validation context
}

export interface ValidationIssue {
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
    category: 'INVENTED_INFO' | 'SEMANTIC_DRIFT' | 'MISSING_MAPPING' | 'SCHEMA_VIOLATION' | 'ACCURACY';
    field: string;
    description: string;
    expected?: string;
    actual?: string;
}

export interface TransformationValidationResult {
    valid: boolean;
    confidenceScore: number;  // 0-100
    issues: ValidationIssue[];
    recommendation: 'APPROVE' | 'REJECT' | 'REVIEW';
    justification: string;
}

export class TransformationValidationAgent {
    private llmService: LLMService;

    constructor() {
        this.llmService = new LLMService();
    }

    /**
     * Validate a transformation using LLM
     * 
     * Sends the original use case and generated capability to LLM
     * and asks it to verify accuracy, detect invented information,
     * and check for semantic drift.
     */
    async validateTransformation(input: ValidationInput): Promise<TransformationValidationResult> {
        logger.info('Starting transformation validation', {
            useCaseKey: input.useCase.key
        });

        try {
            const userPrompt = this.createValidationPrompt(input);

            const messages = [
                { role: 'system' as const, content: TRANSFORMATION_VALIDATION_SYSTEM_PROMPT },
                { role: 'user' as const, content: userPrompt }
            ];

            const rawResult = await this.llmService.chatJSON<Omit<TransformationValidationResult, 'valid'>>(messages);

            // Determine validity based on confidence and issues (95% threshold)
            const criticalIssues = rawResult.issues.filter(i => i.severity === 'CRITICAL');
            const valid = criticalIssues.length === 0 && rawResult.confidenceScore >= 95;

            const result: TransformationValidationResult = {
                ...rawResult,
                valid
            };

            logger.info('Transformation validation complete', {
                useCaseKey: input.useCase.key,
                valid: result.valid,
                confidenceScore: result.confidenceScore,
                issueCount: result.issues.length,
                recommendation: result.recommendation
            });

            return result;
        } catch (error) {
            logger.error('Transformation validation failed', {
                useCaseKey: input.useCase.key,
                error: error instanceof Error ? error.message : String(error)
            });

            // On error, fail safe: recommend review
            return {
                valid: false,
                confidenceScore: 0,
                issues: [{
                    severity: 'CRITICAL',
                    category: 'ACCURACY',
                    field: 'validation',
                    description: `Validation failed: ${error instanceof Error ? error.message : String(error)}`
                }],
                recommendation: 'REVIEW',
                justification: 'Validation process encountered an error'
            };
        }
    }

    /**
     * Create the validation prompt with full context
     */
    private createValidationPrompt(input: ValidationInput): string {
        // Format schemas for LLM if provided
        const useCaseSchemaStr = input.useCaseSchema && Object.keys(input.useCaseSchema).length > 0
            ? `\n## Use Case Schema (Expected Structure)\n\`\`\`\n${JSON.stringify(input.useCaseSchema, null, 2)}\n\`\`\``
            : '';

        const capabilitySchemaStr = input.capabilitySchema && Object.keys(input.capabilitySchema).length > 0
            ? `\n## Capability Schema (Expected Structure)\n\`\`\`\n${JSON.stringify(input.capabilitySchema, null, 2)}\n\`\`\``
            : '';

        return `# TRANSFORMATION VALIDATION REQUEST

## Original Use Case

\`\`\`json
${JSON.stringify(input.useCase, null, 2)}
\`\`\`

## Generated Capability

\`\`\`json
${JSON.stringify(input.capability, null, 2)}
\`\`\`
${useCaseSchemaStr}${capabilitySchemaStr}

## Task

Validate that the capability accurately represents the use case without inventing information.

Check for:
1. **Invented Information**: Did the capability add details not in the use case?
2. **Semantic Drift**: Does the capability's intent match the use case's intent?
3. **Missing Mappings**: Are critical use case elements missing from the capability?
4. **Accuracy**: Are acceptance criteria, flows, and technical components correctly mapped?
5. **Schema Compliance**: Does the capability match the expected schema structure?

Return your validation analysis in the specified JSON format.`;
    }
}
