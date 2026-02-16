import { LLMService } from '../../core/services/llm/llm.service.js';
import { logger } from '../../core/utils/logger.js';
import { ValidationIssue } from '../transformation-validation/transformation-validation.agent.js';
import { SURGICAL_FIX_SYSTEM_PROMPT } from './prompts/surgical-fix-prompt.js';

/**
 * Surgical Fix Agent
 * 
 * Instead of regenerating the entire capability, this agent
 * makes targeted fixes to specific problematic fields identified
 * by validation.
 */

export interface SurgicalFixRequest {
    useCase: any;
    capability: any;
    issues: ValidationIssue[];
    confidenceScore: number;
}

export interface SurgicalFixResult {
    fixedCapability: any;
    fixesApplied: number;
    stillHasIssues: boolean;
}

export class SurgicalFixAgent {
    private llmService: LLMService;

    constructor() {
        this.llmService = new LLMService();
    }

    /**
     * Apply surgical fixes to specific fields in capability
     * 
     * This is more efficient than regenerating everything because:
     * 1. Preserves correctly generated parts
     * 2. Faster (smaller LLM context)
     * 3. More deterministic (focused fixes)
     */
    async applySurgicalFixes(request: SurgicalFixRequest): Promise<SurgicalFixResult> {
        logger.info('Applying surgical fixes', {
            issueCount: request.issues.length,
            currentConfidence: request.confidenceScore
        });

        try {
            // Group issues by severity
            const criticalIssues = request.issues.filter(i => i.severity === 'CRITICAL');
            const majorIssues = request.issues.filter(i => i.severity === 'MAJOR');

            logger.info('Issue breakdown', {
                critical: criticalIssues.length,
                major: majorIssues.length,
                minor: request.issues.length - criticalIssues.length - majorIssues.length
            });

            const userPrompt = this.createSurgicalFixPrompt(request);

            const messages = [
                { role: 'system' as const, content: SURGICAL_FIX_SYSTEM_PROMPT },
                { role: 'user' as const, content: userPrompt }
            ];

            // LLM returns ONLY the fixed fields, not the entire capability
            const fixedFields = await this.llmService.chatJSON<Record<string, any>>(messages);

            // Merge fixes back into capability
            const fixedCapability = this.mergeFixes(request.capability, fixedFields);

            logger.info('Surgical fixes applied', {
                fieldsFixed: Object.keys(fixedFields).length
            });

            return {
                fixedCapability,
                fixesApplied: Object.keys(fixedFields).length,
                stillHasIssues: false  // Will be validated again
            };

        } catch (error) {
            logger.error('Surgical fix failed', {
                error: error instanceof Error ? error.message : String(error)
            });

            // On error, return original capability unchanged
            return {
                fixedCapability: request.capability,
                fixesApplied: 0,
                stillHasIssues: true
            };
        }
    }

    /**
     * Create prompt that shows use case, current capability, and specific issues
     */
    private createSurgicalFixPrompt(request: SurgicalFixRequest): string {
        return `# SURGICAL FIX REQUEST

## Original Use Case (Source of Truth)

\`\`\`json
${JSON.stringify(request.useCase, null, 2)}
\`\`\`

## Current Capability (With Issues)

\`\`\`json
${JSON.stringify(request.capability, null, 2)}
\`\`\`

## Validation Issues (Confidence: ${request.confidenceScore}%)

${request.issues.map((issue, i) => `
### Issue ${i + 1}: [${issue.severity}] ${issue.category}

**Field**: \`${issue.field}\`
**Problem**: ${issue.description}
${issue.expected ? `**Expected**: ${issue.expected}` : ''}
${issue.actual ? `**Actual**: ${issue.actual}` : ''}
`).join('\n')}

## Your Task

**CRITICAL**: Fix ONLY the problematic fields listed above. Do not regenerate the entire capability.

Return a JSON object containing ONLY the fields that need to be fixed with their corrected values.

**Example**: If only \`behavior.acceptanceCriteria\` has issues, return:
\`\`\`json
{
  "behavior": {
    "acceptanceCriteria": [/* corrected array */]
  }
}
\`\`\`

The corrected values will be merged back into the capability.`;
    }

    /**
     * Deep merge fixed fields into capability
     */
    private mergeFixes(capability: any, fixes: Record<string, any>): any {
        const result = JSON.parse(JSON.stringify(capability)); // Deep clone

        const merge = (target: any, source: any) => {
            for (const key in source) {
                if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    merge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        };

        merge(result, fixes);
        return result;
    }
}
