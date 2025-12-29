import { IntentAnalysis, UseCase, ValidationResult } from '../agents/intent-extraction/types/intent-analysis.types.js';

export function validateIntentExtraction(
    analysis: IntentAnalysis,
    useCase: UseCase
): ValidationResult {
    const criticalIssues: string[] = [];
    const warnings: string[] = [];

    // Critical Check 1: userGoal exists
    if (!analysis.userGoal || analysis.userGoal.trim() === '') {
        criticalIssues.push('userGoal is empty');
    }

    // Critical Check 2: systemResponsibilities has items
    if (!analysis.systemResponsibilities || analysis.systemResponsibilities.length === 0) {
        criticalIssues.push('systemResponsibilities is empty');
    }

    // Critical Check 3: acceptanceCriteria count matches
    if (analysis.acceptanceCriteria.length !== useCase.acceptanceCriteria.length) {
        criticalIssues.push(
            `Acceptance criteria count mismatch: expected ${useCase.acceptanceCriteria.length}, got ${analysis.acceptanceCriteria.length}`
        );
    }

    // Critical Check 4: confidence not low
    if (analysis.confidenceLevel === 'low') {
        criticalIssues.push('Confidence level is low');
    }

    // Warning: Missing technical components
    if (
        analysis.technicalComponents.frontend.routes.length === 0 &&
        analysis.technicalComponents.frontend.components.length === 0 &&
        analysis.technicalComponents.backend.endpoints.length === 0 &&
        analysis.technicalComponents.backend.services.length === 0
    ) {
        warnings.push('No technical components extracted');
    }

    // Warning: Security tags but no security considerations
    const hasSecurityTag = useCase.tags.some(tag =>
        ['auth', 'payment', 'security'].includes(tag.toLowerCase())
    );
    if (hasSecurityTag && analysis.securityConsiderations.length === 0) {
        warnings.push('Security-sensitive feature but no security considerations noted');
    }

    // Determine recommendation
    let recommendation: 'proceed' | 'retry' | 'manual_review' = 'proceed';

    if (criticalIssues.length > 0) {
        recommendation = criticalIssues.length > 2 ? 'retry' : 'manual_review';
    }

    return {
        valid: criticalIssues.length === 0,
        criticalIssues,
        warnings,
        recommendation
    };
}
