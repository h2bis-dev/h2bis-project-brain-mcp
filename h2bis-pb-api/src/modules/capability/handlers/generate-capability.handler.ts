import type { UseCase } from '../../../core/schemas/use_case_schema.js';
import type { Feature } from '../../../core/schemas/features_schema.js';
import type { CapabilityNode } from '../../../core/schemas/capability_schema.js';
import { validationService } from '../../use-case/services/validation.service.js';
import { transformationService } from '../../use-case/services/transformation.service.js';
import { transformationValidationService } from '../../use-case/services/transformation-validation.service.js';
import { surgicalFixService } from '../../use-case/services/surgical-fix.service.js';
import { capabilityRepository } from '../repositories/capability.repository.js';

export interface GenerateCapabilityResult {
    capabilityId: string | null;
    generated: boolean;
    mode?: string;
    insufficiencyReport?: any;
    validationReport?: any;
}

/**
 * Generate Capability from Handler Use Case
 * Orchestrates the complex workflow of generating a capability from a use case
 * including normativity checks, LLM transformation, validation, and surgical fixes
 */
export class GenerateCapabilityFromHandlerHandler {
    private readonly maxRetries = 3;

    async execute(useCase: UseCase): Promise<GenerateCapabilityResult> {
        console.log('✅ UseCase detected, starting capability generation workflow...');
        console.log('   UseCase key:', useCase.key);
        console.log('   Normative flag:', useCase.normative);

        try {
            // STEP 1: Check normativity BEFORE any LLM calls
            const normativityCheck = validationService.checkNormativity(useCase);

            console.log('🔒 Normativity Check:', {
                isNormative: normativityCheck.isNormative,
                decision: normativityCheck.decision,
                insufficiencies: normativityCheck.insufficiencies.length
            });

            // STEP 2: Reject if normative but incomplete
            if (normativityCheck.decision === 'REJECT') {
                const report = validationService.buildInsufficientReport(normativityCheck);
                console.error('❌ REJECTED: Normative use case is incomplete');
                console.error('   Insufficiencies:', report.missingFields.map((f: any) => `${f.field}: ${f.reason}`).join('; '));

                return {
                    capabilityId: null,
                    generated: false,
                    mode: 'REJECTED',
                    insufficiencyReport: report
                };
            }

            // STEP 3: Proceed with generation (constrained if normative, standard otherwise)
            const mode = normativityCheck.isNormative ? 'CONSTRAINED' : 'STANDARD';
            console.log(`✅ Proceeding with ${mode} capability generation...`);

            // RETRY LOOP: Attempt generation up to 3 times with validation feedback
            let attempt = 0;
            let capability: CapabilityNode | null = null;
            let validationFeedback: string[] = [];

            while (attempt < this.maxRetries) {
                attempt++;
                console.log(`🔄 Generation attempt ${attempt}/${this.maxRetries}${validationFeedback.length > 0 ? ' (with corrections)' : ''}...`);

                try {
                    // Use LLM-based transformation with strict mode flag and feedback
                    capability = await transformationService.transformHandlerToCapabilityWithIntent(
                        useCase,
                        {
                            strictMode: normativityCheck.isNormative,
                            validationFeedback: validationFeedback.length > 0 ? validationFeedback : undefined
                        }
                    );

                    // Null check: ensure transformation succeeded
                    if (!capability) {
                        throw new Error('Transformation service returned null capability');
                    }

                    console.log('   Transformed capability ID:', capability.id);
                    console.log('   Capability kind:', capability.kind);
                    console.log('   Intent confidence:', (capability as any).intentAnalysis?.confidenceLevel);

                    // STEP 4: Validate transformation using LLM
                    const shouldSkipValidation = useCase.aiMetadata?.skipValidation === true;

                    if (!shouldSkipValidation) {
                        console.log('🔍 Running post-generation validation by LLM...');

                        const validationResult = await transformationValidationService.validateTransformation(
                            useCase,
                            capability
                        );

                        console.log('✅ Validation complete:', {
                            valid: validationResult.valid,
                            confidenceScore: validationResult.confidenceScore,
                            recommendation: validationResult.recommendation,
                            issueCount: validationResult.issues.length,
                            attempt
                        });

                        // Handle validation results based on confidence score
                        if (validationResult.recommendation === 'APPROVE') {
                            console.log(`✅ Validation APPROVED with ${validationResult.confidenceScore}% confidence`);
                            break; // Exit retry loop
                        }

                        if (validationResult.recommendation === 'REVIEW') {
                            console.log(`⚠️  Validation needs REVIEW (${validationResult.confidenceScore}% confidence)`);
                            console.log(`   Applying surgical fixes to ${validationResult.issues.length} issue(s)...`);

                            if (attempt < this.maxRetries) {
                                try {
                                    const fixResult = await surgicalFixService.applySurgicalFixes(
                                        useCase,
                                        capability,
                                        validationResult.issues,
                                        validationResult.confidenceScore
                                    );

                                    console.log(`   🔧 Surgical fixes applied: ${fixResult.fixesApplied} field(s)`);
                                    capability = fixResult.fixedCapability;
                                    console.log(`   🔄 Re-validating fixed capability...`);
                                    continue;

                                } catch (surgicalError) {
                                    console.error('   ❌ Surgical fix failed, falling back to full regeneration:', surgicalError);
                                }
                            } else {
                                console.warn(`   ⚠️  No retries left, accepting with warnings`);
                                break;
                            }
                        }

                        if (validationResult.recommendation === 'REJECT') {
                            console.error(`❌ VALIDATION REJECTED (Attempt ${attempt}/${this.maxRetries})`);
                            console.error('   Confidence too low:', validationResult.confidenceScore + '%');

                            if (attempt < this.maxRetries) {
                                console.log(`🔄 Preparing feedback for retry attempt ${attempt + 1}...`);

                                // Build feedback from validation issues
                                validationFeedback = validationResult.issues.map((issue: any) =>
                                    `[${issue.severity}] ${issue.field}: ${issue.description}${issue.expected ? ` | Expected: ${issue.expected}` : ''}`
                                );

                                console.log(`   Feedback items: ${validationFeedback.length}`);
                                continue; // Retry generation
                            } else {
                                // Final attempt failed
                                console.error('❌ All retry attempts exhausted. Rejecting generation.');

                                return {
                                    capabilityId: null,
                                    generated: false,
                                    mode: 'REJECTED',
                                    validationReport: {
                                        message: `Capability generation failed validation after ${attempt} attempts`,
                                        confidenceScore: validationResult.confidenceScore,
                                        issues: validationResult.issues,
                                        justification: validationResult.justification,
                                        recommendation: 'Review use case completeness or set aiMetadata.skipValidation=true'
                                    }
                                };
                            }
                        }
                    } else {
                        console.log('⚠️  SKIPPING LLM validation (aiMetadata.skipValidation=true)');
                    }

                    // Successfully generated and validated
                    console.log(`✅ Capability generation succeeded on attempt ${attempt}`);
                    break;

                } catch (genError) {
                    console.error(`❌ Generation failed on attempt ${attempt}/${this.maxRetries}:`, genError);

                    if (attempt >= this.maxRetries) {
                        throw genError; // Re-throw on final attempt
                    }

                    console.log(`🔄 Retrying generation...`);
                }
            }

            // STEP 5: Save capability (if we got here, generation succeeded)
            if (capability) {
                const capabilityId = await capabilityRepository.create(capability);
                console.log(`✅ Auto-generated capability ${capabilityId} in ${mode} mode from use case ${useCase.key}`);

                if (attempt > 1) {
                    console.log(`   ℹ️  Required ${attempt} attempt(s) with self-correction`);
                }

                return {
                    capabilityId,
                    generated: true,
                    mode
                };
            }

            // Fallback (should not reach here)
            return {
                capabilityId: null,
                generated: false
            };

        } catch (error) {
            console.error(`❌ Failed to auto-generate capability:`, error);
            console.error('   Error details:', error instanceof Error ? error.message : String(error));

            // Don't throw - just return failure result
            return {
                capabilityId: null,
                generated: false
            };
        }
    }
}

/**
 * Generate Capability from Feature Use Case
 * Simpler workflow for feature-based capability generation
 */
export class GenerateCapabilityFromFeatureHandler {
    async execute(feature: Feature): Promise<GenerateCapabilityResult> {
        console.log('✅ Feature detected, starting capability generation...');

        try {
            const capability = transformationService.transformFeatureToCapability(feature);
            console.log('   Transformed capability ID:', capability.id);

            const capabilityId = await capabilityRepository.create(capability);
            console.log(`✅ Auto-generated capability ${capabilityId} from feature ${feature.key}`);

            return {
                capabilityId,
                generated: true
            };
        } catch (error) {
            console.error(`❌ Failed to auto-generate capability:`, error);
            console.error('   Error details:', error instanceof Error ? error.message : String(error));

            return {
                capabilityId: null,
                generated: false
            };
        }
    }
}

// Export singleton instances
export const generateCapabilityFromHandlerHandler = new GenerateCapabilityFromHandlerHandler();
export const generateCapabilityFromFeatureHandler = new GenerateCapabilityFromFeatureHandler();
