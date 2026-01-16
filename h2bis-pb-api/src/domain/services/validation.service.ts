import { Handler } from '../schemas/use_case_schema.js';
import { CapabilityNode } from '../schemas/capability_schema.js';
import { IntentAnalysis } from 'h2bis-pb-ai';
import { NormativityCheck, Insufficiency, InsufficientReport } from '../types/normative-validation.types.js';

/**
 * Validation Service
 * Implements 7-layer quality assurance strategy for capability generation
 * 
 * Layers:
 * 1. Pre-Validation: Required fields check
 * 2. Intent Extraction: (handled by h2bis-pb-ai)
 * 3. Extraction Validation: Quality checks on intent
 * 4. Capability Generation: (handled by transformation.service)
 * 5. Post-Generation Validation: Consistency checks
 * 6. Human Review: Risk-gated review workflow
 * 7. Cross-Validation: (future - runtime verification)
 */

/* ============================================================================
   VALIDATION RESULT TYPES
   ============================================================================ */

export interface ValidationResult {
    valid: boolean;
    criticalIssues: string[];
    warnings: string[];
    recommendation: 'proceed' | 'fix_required' | 'manual_review' | 'retry';
}

export interface ConsistencyValidationResult {
    valid: boolean;
    consistencyIssues: string[];
    missingFields: string[];
    recommendation: 'approved' | 'needs_correction';
}

export interface ReviewDecision {
    requiresReview: boolean;
    reason?: string;
    autoApprove: boolean;
}

/* ============================================================================
   LAYER 1: PRE-VALIDATION (REQUIRED FIELDS CHECK)
   ============================================================================ */

export class ValidationService {

    /**
     * Layer 1: Validate use case has minimum required fields
     * Runs BEFORE intent extraction
     */
    validateHandlerCompleteness(Handler: Handler): ValidationResult {
        const criticalIssues: string[] = [];
        const warnings: string[] = [];

        // Critical Fields (MUST be present)
        if (!Handler.type || Handler.type !== 'use_case') {
            criticalIssues.push('type must be "use_case"');
        }

        if (!Handler.key || Handler.key.trim() === '') {
            criticalIssues.push('key is required and cannot be empty');
        }

        if (!Handler.name || Handler.name.trim() === '') {
            criticalIssues.push('name is required and cannot be empty');
        }

        if (!Handler.description || Handler.description.trim() === '') {
            criticalIssues.push('description is required and cannot be empty');
        }

        if (!Handler.businessValue || Handler.businessValue.trim() === '') {
            criticalIssues.push('businessValue is required and cannot be empty');
        }

        if (!Handler.primaryActor || Handler.primaryActor.trim() === '') {
            criticalIssues.push('primaryActor is required and cannot be empty');
        }

        if (!Handler.status?.lifecycle) {
            criticalIssues.push('status.lifecycle is required');
        }

        if (!Handler.acceptanceCriteria || Handler.acceptanceCriteria.length === 0) {
            warnings.push('No acceptance criteria provided - LLM will infer from description');
        }

        if (!Handler.flows || Handler.flows.length === 0) {
            warnings.push('No flows provided - LLM will infer basic flow structure');
        } else {
            const hasMainFlow = Handler.flows.some(f => f.type === 'main');
            if (!hasMainFlow) {
                warnings.push('No main flow specified - one will be inferred');
            }
        }

        // Important Fields (SHOULD be present - warnings only)
        const hasFrontend = Handler.technicalSurface?.frontend?.routes?.length > 0 ||
            Handler.technicalSurface?.frontend?.components?.length > 0;
        const hasBackend = Handler.technicalSurface?.backend?.endpoints?.length > 0 ||
            Handler.technicalSurface?.backend?.repos?.length > 0;

        if (!hasFrontend && !hasBackend) {
            warnings.push('No technical surface specified (neither frontend nor backend)');
        }

        if (Handler.flows.length > 0 && Handler.flows[0].steps?.length < 3) {
            warnings.push('Main flow has fewer than 3 steps - may be too simplistic');
        }

        // Warning Conditions
        if (!Handler.relationships || Handler.relationships.length === 0) {
            warnings.push('No relationships defined - capability may be isolated');
        }

        if (!Handler.tags || Handler.tags.length === 0) {
            warnings.push('No tags specified - may affect discoverability');
        }

        if (!Handler.aiMetadata) {
            warnings.push('No AI metadata provided - using defaults');
        }

        // Determine recommendation
        let recommendation: 'proceed' | 'fix_required' | 'manual_review' | 'retry';
        if (criticalIssues.length > 0) {
            recommendation = 'fix_required';
        } else if (warnings.length > 3) {
            recommendation = 'manual_review';
        } else {
            recommendation = 'proceed';
        }

        return {
            valid: criticalIssues.length === 0,
            criticalIssues,
            warnings,
            recommendation
        };
    }

    /* ========================================================================
       NORMATIVE VALIDATION (NO-INFERENCE MODE)
       ======================================================================== */

    /**
     * Check if use case is normative and complete
     * Returns decision: PROCEED or REJECT
     * 
     * This runs BEFORE LLM call to prevent expensive API calls on incomplete data
     */
    checkNormativity(Handler: Handler): NormativityCheck {
        // If not normative, allow standard generation with inference
        if (!Handler.normative) {
            return {
                isNormative: false,
                isComplete: true,
                insufficiencies: [],
                decision: 'PROCEED'
            };
        }

        const insufficiencies: Insufficiency[] = [];

        // CRITICAL: All these must be present and non-empty for normative mode
        const criticalStringFields = [
            { field: 'name', value: Handler.name },
            { field: 'description', value: Handler.description },
            { field: 'businessValue', value: Handler.businessValue },
            { field: 'primaryActor', value: Handler.primaryActor }
        ];

        for (const check of criticalStringFields) {
            if (!check.value || check.value.trim() === '') {
                insufficiencies.push({
                    field: check.field,
                    reason: `Normative use case requires '${check.field}' to be complete and non-empty`,
                    severity: 'CRITICAL'
                });
            }
        }

        // CRITICAL: Acceptance criteria must exist
        if (!Handler.acceptanceCriteria || Handler.acceptanceCriteria.length === 0) {
            insufficiencies.push({
                field: 'acceptanceCriteria',
                reason: 'Normative use case requires at least one acceptance criterion',
                severity: 'CRITICAL'
            });
        }

        // CRITICAL: Flows must exist
        if (!Handler.flows || Handler.flows.length === 0) {
            insufficiencies.push({
                field: 'flows',
                reason: 'Normative use case requires at least one flow',
                severity: 'CRITICAL'
            });
        } else {
            // CRITICAL: At least one main flow
            const hasMainFlow = Handler.flows.some(f => f.type === 'main');
            if (!hasMainFlow) {
                insufficiencies.push({
                    field: 'flows',
                    reason: 'Normative use case requires at least one flow with type="main"',
                    severity: 'CRITICAL'
                });
            }

            // CRITICAL: Main flow must have steps
            const mainFlow = Handler.flows.find(f => f.type === 'main');
            if (mainFlow && (!mainFlow.steps || mainFlow.steps.length === 0)) {
                insufficiencies.push({
                    field: 'flows[0].steps',
                    reason: 'Normative use case requires main flow to have concrete steps',
                    severity: 'CRITICAL'
                });
            }
        }

        // CRITICAL: Technical surface must be specified
        const hasFrontend = Handler.technicalSurface?.frontend?.routes?.length > 0 ||
            Handler.technicalSurface?.frontend?.components?.length > 0;
        const hasBackend = Handler.technicalSurface?.backend?.endpoints?.length > 0;

        if (!hasFrontend && !hasBackend) {
            insufficiencies.push({
                field: 'technicalSurface',
                reason: 'Normative use case requires explicit technical surface (frontend routes/components OR backend endpoints)',
                severity: 'CRITICAL'
            });
        }

        const decision = insufficiencies.length === 0 ? 'PROCEED' : 'REJECT';

        return {
            isNormative: true,
            isComplete: decision === 'PROCEED',
            insufficiencies,
            decision
        };
    }

    /**
     * Build detailed insufficiency report for rejected normative use cases
     */
    buildInsufficientReport(check: NormativityCheck): InsufficientReport {
        const criticalIssues = check.insufficiencies.filter((i: Insufficiency) => i.severity === 'CRITICAL');

        return {
            message: `Cannot generate capability: ${criticalIssues.length} critical insufficiency(ies) detected in normative use case`,
            missingFields: check.insufficiencies,
            recommendations: [
                'Provide complete metadata for all normative fields',
                'Ensure technical surface is explicitly defined (frontend routes/components OR backend endpoints)',
                'Add at least one main flow with concrete steps',
                'Verify all acceptance criteria are specified',
                'Set normative=false if approximate generation with AI inference is acceptable'
            ]
        };
    }

    /* ========================================================================
       LAYER 3: EXTRACTION VALIDATION (INTENT QUALITY)
       ======================================================================== */

    /**
     * Layer 3: Validate intent extraction quality
     * Runs AFTER intent extraction, BEFORE capability generation
     * 
     * V1 Simplified: Only 4 critical checks, everything else is warnings
     */
    validateIntentExtraction(analysis: IntentAnalysis, Handler: Handler): ValidationResult {
        const criticalIssues: string[] = [];
        const warnings: string[] = [];

        // CRITICAL CHECK 1: userGoal exists
        if (!analysis.userGoal || analysis.userGoal.trim() === '') {
            criticalIssues.push('userGoal is empty - cannot generate capability');
        }

        // CRITICAL CHECK 2: systemResponsibilities has items
        if (!analysis.systemResponsibilities || analysis.systemResponsibilities.length === 0) {
            criticalIssues.push('systemResponsibilities is empty - cannot define system behavior');
        }

        // CRITICAL CHECK 3: acceptanceCriteria count matches
        if (analysis.acceptanceCriteria.length !== Handler.acceptanceCriteria.length) {
            criticalIssues.push(
                `Acceptance criteria count mismatch with use case: expected ${Handler.acceptanceCriteria.length}, got ${analysis.acceptanceCriteria.length}`
            );
        }

        // CRITICAL CHECK 4: confidence not low
        if (analysis.confidenceLevel === 'low') {
            criticalIssues.push('Confidence level is low - extraction quality insufficient');
        }

        // WARNINGS (non-blocking)

        // Missing technical components
        const hasAnyTech =
            analysis.technicalComponents.frontend.routes.length > 0 ||
            analysis.technicalComponents.frontend.components.length > 0 ||
            analysis.technicalComponents.backend.endpoints.length > 0 ||
            analysis.technicalComponents.backend.services.length > 0;

        if (!hasAnyTech) {
            warnings.push('No technical components extracted - capability may lack implementation details');
        }

        // Ambiguities present
        if (analysis.ambiguities && analysis.ambiguities.length > 0) {
            warnings.push(`${analysis.ambiguities.length} ambiguities detected: ${analysis.ambiguities.join(', ')}`);
        }

        // Assumptions made
        if (analysis.assumptions && analysis.assumptions.length > 0) {
            warnings.push(`${analysis.assumptions.length} assumptions made: ${analysis.assumptions.join(', ')}`);
        }

        // Security considerations for security-tagged features
        const hasSecurityTag = Handler.tags?.some(tag =>
            ['auth', 'payment', 'security'].includes(tag.toLowerCase())
        );
        if (hasSecurityTag && (!analysis.securityConsiderations || analysis.securityConsiderations.length === 0)) {
            warnings.push('Security-sensitive feature but no security considerations noted');
        }

        // Missing information
        if (analysis.missingInformation && analysis.missingInformation.length > 0) {
            warnings.push(`Missing information: ${analysis.missingInformation.join(', ')}`);
        }

        // Determine recommendation
        let recommendation: 'proceed' | 'fix_required' | 'manual_review' | 'retry';
        if (criticalIssues.length > 0) {
            // Multiple critical issues = retry extraction
            recommendation = criticalIssues.length > 2 ? 'retry' : 'manual_review';
        } else {
            recommendation = 'proceed';
        }

        return {
            valid: criticalIssues.length === 0,
            criticalIssues,
            warnings,
            recommendation
        };
    }

    /* ========================================================================
       LAYER 5: POST-GENERATION VALIDATION (CONSISTENCY)
       ======================================================================== */

    /**
     * Layer 5: Validate generated capability is consistent with intent
     * Runs AFTER capability generation
     */
    validateCapabilityConsistency(
        capability: CapabilityNode,
        analysis: IntentAnalysis,
        Handler: Handler
    ): ConsistencyValidationResult {
        const consistencyIssues: string[] = [];
        const missingFields: string[] = [];

        // Data Consistency: Acceptance criteria count
        if (capability.behavior.acceptanceCriteria.length !== Handler.acceptanceCriteria.length) {
            consistencyIssues.push(
                `Capability acceptance criteria count (${capability.behavior.acceptanceCriteria.length}) ` +
                `doesn't match use case (${Handler.acceptanceCriteria.length})`
            );
        }

        if (capability.behavior.acceptanceCriteria.length !== analysis.acceptanceCriteria.length) {
            consistencyIssues.push(
                `Capability acceptance criteria count (${capability.behavior.acceptanceCriteria.length}) ` +
                `doesn't match analysis (${analysis.acceptanceCriteria.length})`
            );
        }

        // Data Consistency: Flow count
        if (capability.behavior.flows.length !== Handler.flows.length) {
            consistencyIssues.push(
                `Capability flow count (${capability.behavior.flows.length}) ` +
                `doesn't match use case (${Handler.flows.length})`
            );
        }

        // Semantic Consistency: Frontend
        const analysisHasFrontend =
            analysis.technicalComponents.frontend.routes.length > 0 ||
            analysis.technicalComponents.frontend.components.length > 0;

        if (analysisHasFrontend && !capability.realization.frontend) {
            consistencyIssues.push('Analysis has frontend components but capability does not');
        }

        // Semantic Consistency: Backend
        const analysisHasBackend =
            analysis.technicalComponents.backend.endpoints.length > 0 ||
            analysis.technicalComponents.backend.services.length > 0;

        if (analysisHasBackend && !capability.realization.backend) {
            consistencyIssues.push('Analysis has backend components but capability does not');
        }

        // Semantic Consistency: Data
        if (analysis.technicalComponents.data.length > 0 &&
            (!capability.realization.data || capability.realization.data.length === 0)) {
            consistencyIssues.push('Analysis has data operations but capability does not');
        }

        // Completeness: Required fields
        if (!capability.id || capability.id.trim() === '') {
            missingFields.push('id');
        }

        if (!capability.intent.userGoal || capability.intent.userGoal.trim() === '') {
            missingFields.push('intent.userGoal');
        }

        if (!capability.intent.systemResponsibility || capability.intent.systemResponsibility.trim() === '') {
            missingFields.push('intent.systemResponsibility');
        }

        if (!capability.behavior.acceptanceCriteria || capability.behavior.acceptanceCriteria.length === 0) {
            missingFields.push('behavior.acceptanceCriteria');
        }

        // Completeness: Arrays have content where expected
        if (analysisHasFrontend && capability.realization.frontend) {
            if (capability.realization.frontend.routes.length === 0 &&
                capability.realization.frontend.components.length === 0) {
                consistencyIssues.push('Capability frontend is defined but has no routes or components');
            }
        }

        if (analysisHasBackend && capability.realization.backend) {
            if (capability.realization.backend.endpoints.length === 0 &&
                capability.realization.backend.services.length === 0) {
                consistencyIssues.push('Capability backend is defined but has no endpoints or services');
            }
        }

        // Determine recommendation
        const recommendation: 'approved' | 'needs_correction' =
            (consistencyIssues.length === 0 && missingFields.length === 0)
                ? 'approved'
                : 'needs_correction';

        return {
            valid: consistencyIssues.length === 0 && missingFields.length === 0,
            consistencyIssues,
            missingFields,
            recommendation
        };
    }

    /* ========================================================================
       LAYER 6: HUMAN REVIEW (RISK-GATED)
       ======================================================================== */

    /**
     * Layer 6: Determine if capability requires human review
     * V1 Simplified: Only gate on confidence or security tags
     */
    shouldRequireReview(capability: CapabilityNode, analysis: IntentAnalysis): ReviewDecision {
        const reasons: string[] = [];

        // Condition 1: Confidence is not high
        if (analysis.confidenceLevel !== 'high') {
            reasons.push(`Extraction confidence is ${analysis.confidenceLevel} (not high)`);
        }

        // Condition 2: Security-sensitive tags
        const securityTags = ['auth', 'payment', 'security'];
        const hasSecurityTag = capability.tags?.some(tag =>
            securityTags.includes(tag.toLowerCase())
        );

        if (hasSecurityTag) {
            reasons.push('Security-sensitive feature detected (tags: ' +
                capability.tags.filter(t => securityTags.includes(t.toLowerCase())).join(', ') + ')');
        }

        const requiresReview = reasons.length > 0;

        return {
            requiresReview,
            reason: reasons.length > 0 ? reasons.join('; ') : undefined,
            autoApprove: !requiresReview
        };
    }

    /* ========================================================================
       CONVENIENCE METHODS
       ======================================================================== */

    /**
     * Run all validation layers in sequence
     * Returns aggregated results
     */
    async runFullValidation(
        Handler: Handler,
        analysis: IntentAnalysis,
        capability: CapabilityNode
    ): Promise<{
        layer1: ValidationResult;
        layer3: ValidationResult;
        layer5: ConsistencyValidationResult;
        layer6: ReviewDecision;
        overallValid: boolean;
        blockers: string[];
        allWarnings: string[];
    }> {
        // Layer 1: Pre-validation
        const layer1 = this.validateHandlerCompleteness(Handler);

        // Layer 3: Extraction validation
        const layer3 = this.validateIntentExtraction(analysis, Handler);

        // Layer 5: Post-generation validation
        const layer5 = this.validateCapabilityConsistency(capability, analysis, Handler);

        // Layer 6: Review decision
        const layer6 = this.shouldRequireReview(capability, analysis);

        // Aggregate blockers
        const blockers = [
            ...layer1.criticalIssues,
            ...layer3.criticalIssues,
            ...layer5.consistencyIssues,
            ...layer5.missingFields
        ];

        // Aggregate warnings
        const allWarnings = [
            ...layer1.warnings,
            ...layer3.warnings
        ];

        const overallValid = layer1.valid && layer3.valid && layer5.valid;

        return {
            layer1,
            layer3,
            layer5,
            layer6,
            overallValid,
            blockers,
            allWarnings
        };
    }

    /**
     * Log validation results (for debugging)
     */
    logValidationResults(results: any, prefix: string = ''): void {
        console.log(`${prefix}Validation Results:`);
        console.log(`  Overall Valid: ${results.overallValid ? '✅' : '❌'}`);

        if (results.blockers.length > 0) {
            console.log(`  Blockers (${results.blockers.length}):`);
            results.blockers.forEach((b: string) => console.log(`    ❌ ${b}`));
        }

        if (results.allWarnings.length > 0) {
            console.log(`  Warnings (${results.allWarnings.length}):`);
            results.allWarnings.forEach((w: string) => console.log(`    ⚠️  ${w}`));
        }

        console.log(`  Review Required: ${results.layer6.requiresReview ? '🔍 YES' : '✅ NO'}`);
        if (results.layer6.reason) {
            console.log(`    Reason: ${results.layer6.reason}`);
        }
    }
}

export const validationService = new ValidationService();
