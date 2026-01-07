import { SurgicalFixAgent, SurgicalFixRequest, SurgicalFixResult } from 'h2bis-pb-ai';

/**
 * Surgical Fix Service
 * 
 * Wraps the SurgicalFixAgent to provide targeted field-level fixes
 * for capabilities that need improvement without full regeneration.
 */
class SurgicalFixService {
    private agent: SurgicalFixAgent;

    constructor() {
        this.agent = new SurgicalFixAgent();
    }

    /**
     * Apply surgical fixes to specific problematic fields
     * 
     * @param useCase - Original use case
     * @param capability - Current capability with issues
     * @param issues - Validation issues identifying what's wrong
     * @param confidenceScore - Current confidence score
     * @returns Fixed capability and metadata
     */
    async applySurgicalFixes(
        useCase: any,
        capability: any,
        issues: any[],
        confidenceScore: number
    ): Promise<SurgicalFixResult> {
        return this.agent.applySurgicalFixes({
            useCase,
            capability,
            issues,
            confidenceScore
        });
    }
}

export const surgicalFixService = new SurgicalFixService();
