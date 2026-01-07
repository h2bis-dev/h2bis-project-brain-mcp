import { Request, Response } from 'express';
import { getDb } from '../db.js';
import { z } from 'zod';
import { EntitySchema } from '../db_schema/entity_schema.js';
import { UseCaseSchema } from '../db_schema/use_case_schema.js';
import { FeatureSchema } from '../db_schema/features_schema.js';
import {
    InsertDocumentRequestSchema,
    FindDocumentRequestSchema,
    UpdateDocumentRequestSchema,
    DeleteDocumentRequestSchema
} from '../validation/request.schemas.js';
import { transformationService } from '../services/transformation.service.js';
import { capabilityService } from '../services/capability.service.js';
import { validationService } from '../services/validation.service.js';
import { transformationValidationService } from '../services/transformation-validation.service.js';
import { surgicalFixService } from '../services/surgical-fix.service.js';

/**
 * Insert a document into a collection
 * Validates both request structure AND entity schema
 * 
 * NEW: Auto-generates CapabilityNode if inserting a UseCase or Feature
 */
export async function insertDocument(req: Request, res: Response) {
    try {
        // 1. Validate request structure
        const { collectionName, document } = InsertDocumentRequestSchema.parse(req.body);

        // 2. Validate entity schema (feature or use_case)
        const validatedEntity = EntitySchema.parse(document);

        // 3. Insert validated entity into database
        const db = await getDb();
        const result = await db.collection(collectionName).insertOne(validatedEntity);

        // 4. AUTO-GENERATE CAPABILITY (if entity is UseCase or Feature)
        let capabilityId: string | null = null;

        console.log('🔍 Checking for capability auto-generation...');
        console.log('   Entity has "type" field:', 'type' in validatedEntity);

        // check if document "type" is not null
        if ('type' in validatedEntity) {
            console.log('Entity type:', validatedEntity.type);

            // if "use_case"
            if (validatedEntity.type === 'use_case') {
                console.log('✅ UseCase detected, validating for capability generation...');

                // Transform UseCase → CapabilityNode using LLM intent extraction
                const useCaseResult = UseCaseSchema.safeParse(validatedEntity);
                console.log('   UseCase validation result:', useCaseResult.success ? 'SUCCESS' : 'FAILED');

                if (useCaseResult.success) {
                    console.log('   UseCase key:', useCaseResult.data.key);
                    console.log('   Normative flag:', useCaseResult.data.normative);

                    try {
                        // STEP 1: Check normativity BEFORE any LLM calls
                        const normativityCheck = validationService.checkNormativity(useCaseResult.data);

                        console.log('🔒 Normativity Check:', {
                            isNormative: normativityCheck.isNormative,
                            decision: normativityCheck.decision,
                            insufficiencies: normativityCheck.insufficiencies.length
                        });

                        // STEP 2: Reject if normative but incomplete
                        if (normativityCheck.decision === 'REJECT') {
                            const report = validationService.buildInsufficientReport(normativityCheck);
                            console.error('❌ REJECTED: Normative use case is incomplete');
                            console.error('   Insufficiencies:', report.missingFields.map(f => `${f.field}: ${f.reason}`).join('; '));

                            // Return 400 with detailed insufficiency report
                            return res.status(400).json({
                                insertedId: result.insertedId.toString(),
                                capabilityGenerated: false,
                                mode: 'REJECTED',
                                insufficiencyReport: report
                            });
                        }

                        // STEP 3: Proceed with generation (constrained if normative, standard otherwise)
                        const mode = normativityCheck.isNormative ? 'CONSTRAINED' : 'STANDARD';
                        console.log(`✅ Proceeding with ${mode} capability generation...`);

                        // RETRY LOOP: Attempt generation up to 3 times with validation feedback
                        const maxRetries = 3;
                        let attempt = 0;
                        let capability: any = null;
                        let lastValidationResult: any = null;
                        let validationFeedback: string[] = [];

                        while (attempt < maxRetries) {
                            attempt++;
                            console.log(`🔄 Generation attempt ${attempt}/${maxRetries}${validationFeedback.length > 0 ? ' (with corrections)' : ''}...`);

                            try {
                                // NEW: Use LLM-based transformation with strict mode flag and feedback
                                capability = await transformationService.transformUseCaseToCapabilityWithIntent(
                                    useCaseResult.data,
                                    {
                                        strictMode: normativityCheck.isNormative,
                                        validationFeedback: validationFeedback.length > 0 ? validationFeedback : undefined
                                    }
                                );

                                console.log('   Transformed capability ID:', capability.id);
                                console.log('   Capability kind:', capability.kind);
                                console.log('   Intent confidence:', capability.intentAnalysis?.confidenceLevel);

                                // STEP 4: Validate transformation using LLM
                                // NOTE: Validation runs by DEFAULT unless explicitly disabled via skipValidation flag
                                const shouldSkipValidation = useCaseResult.data.aiMetadata?.skipValidation === true;

                                if (!shouldSkipValidation) {
                                    console.log('🔍 Running post-generation validation by LLM... usecase vs capability...');

                                    const validationResult = await transformationValidationService.validateTransformation(
                                        useCaseResult.data,
                                        capability
                                    );

                                    console.log('✅ Validation complete:', {
                                        valid: validationResult.valid,
                                        confidenceScore: validationResult.confidenceScore,
                                        recommendation: validationResult.recommendation,
                                        issueCount: validationResult.issues.length,
                                        attempt
                                    });

                                    lastValidationResult = validationResult;

                                    // Handle validation results based on confidence score
                                    // APPROVE: ≥95% - Accept and save
                                    // REVIEW: 70-94% - Apply surgical fixes
                                    // REJECT: <70% - Full regeneration

                                    if (validationResult.recommendation === 'APPROVE') {
                                        // Confidence ≥95%, accept it
                                        console.log(`✅ Validation APPROVED with ${validationResult.confidenceScore}% confidence`);
                                        if (validationResult.issues.length > 0) {
                                            console.warn(`   Minor issues (${validationResult.issues.length}):`,
                                                validationResult.issues.map((i: any) => `${i.severity}: ${i.description}`).join(', ')
                                            );
                                        }
                                        break; // Exit retry loop, capability is good enough
                                    }

                                    if (validationResult.recommendation === 'REVIEW') {
                                        // Confidence 70-94%, apply SURGICAL fixes instead of full regeneration
                                        console.log(`⚠️  Validation needs REVIEW (${validationResult.confidenceScore}% confidence)`);
                                        console.log(`   Applying surgical fixes to ${validationResult.issues.length} issue(s)...`);

                                        if (attempt < maxRetries) {
                                            try {
                                                const fixResult = await surgicalFixService.applySurgicalFixes(
                                                    useCaseResult.data,
                                                    capability,
                                                    validationResult.issues,
                                                    validationResult.confidenceScore
                                                );

                                                console.log(`   🔧 Surgical fixes applied: ${fixResult.fixesApplied} field(s)`);

                                                // Update capability with fixed version
                                                capability = fixResult.fixedCapability;

                                                // Continue to re-validate the fixed capability
                                                // The loop will run again: generate→validate→fix (up to 3 times total)
                                                console.log(`   🔄 Re-validating fixed capability...`);
                                                continue;

                                            } catch (surgicalError) {
                                                console.error('   ❌ Surgical fix failed, falling back to full regeneration:', surgicalError);
                                                // Fall through to REJECT logic below
                                            }
                                        } else {
                                            console.warn(`   ⚠️  No retries left, accepting with warnings`);
                                            break; // Accept with warnings on final attempt
                                        }
                                    }

                                    if (validationResult.recommendation === 'REJECT') {
                                        // Confidence <70%, full regeneration needed
                                        console.error(`❌ VALIDATION REJECTED (Attempt ${attempt}/${maxRetries})`);
                                        console.error('   Confidence too low:', validationResult.confidenceScore + '%');
                                        console.error('   Issues:', validationResult.issues.map((i: any) =>
                                            `[${i.severity}] ${i.category} in ${i.field}: ${i.description}`
                                        ).join('\n   '));

                                        // If we have retries left, prepare feedback and try again
                                        if (attempt < maxRetries) {
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

                                            return res.status(400).json({
                                                insertedId: result.insertedId.toString(),
                                                capabilityGenerated: false,
                                                mode: 'REJECTED',
                                                validationFailed: true,
                                                attempts: attempt,
                                                validationReport: {
                                                    message: `Capability generation failed validation after ${attempt} attempts`,
                                                    confidenceScore: validationResult.confidenceScore,
                                                    issues: validationResult.issues,
                                                    justification: validationResult.justification,
                                                    recommendation: 'Review use case completeness or set aiMetadata.skipValidation=true to bypass validation'
                                                }
                                            });
                                        }
                                    }

                                    // Validation passed or REVIEW (not REJECT)
                                    if (validationResult.issues.length > 0) {
                                        console.warn(`⚠️  Validation passed with ${validationResult.issues.length} issue(s) on attempt ${attempt}:`,
                                            validationResult.issues.map((i: any) => `${i.severity}: ${i.description}`).join(', ')
                                        );
                                    }
                                } else {
                                    console.log('⚠️  SKIPPING LLM validation (aiMetadata.skipValidation=true)');
                                }

                                // Successfully generated and validated, break out of retry loop
                                console.log(`✅ Capability generation succeeded on attempt ${attempt}`);
                                break;

                            } catch (genError) {
                                console.error(`❌ Generation failed on attempt ${attempt}/${maxRetries}:`, genError);

                                if (attempt >= maxRetries) {
                                    throw genError; // Re-throw on final attempt
                                }

                                // Otherwise, continue to next retry
                                console.log(`🔄 Retrying generation...`);
                            }
                        }

                        // STEP 5: Save capability (if we got here, generation succeeded)
                        if (capability) {
                            capabilityId = await capabilityService.createNode(capability);
                            console.log(`✅ Auto-generated capability ${capabilityId} in ${mode} mode from use case ${validatedEntity.key}`);

                            if (attempt > 1) {
                                console.log(`   ℹ️  Required ${attempt} attempt(s) with self-correction`);
                            }
                        }
                    } catch (error) {
                        console.error(`❌ Failed to auto-generate capability:`, error);
                        console.error('   Error details:', error instanceof Error ? error.message : String(error));
                        console.error('   Stack trace:', error instanceof Error ? error.stack : 'N/A');
                        // Don't fail the whole request, just log the warning
                    }
                } else {
                    console.warn('⚠️ UseCase validation failed:', useCaseResult.error.errors);
                }
            } else if (validatedEntity.type === 'feature') {
                console.log('✅ Feature detected, starting transformation...');

                // Transform Feature → CapabilityNode
                const featureResult = FeatureSchema.safeParse(validatedEntity);
                console.log('   Feature validation result:', featureResult.success ? 'SUCCESS' : 'FAILED');

                if (featureResult.success) {
                    try {
                        const capability = transformationService.transformFeatureToCapability(featureResult.data);
                        console.log('   Transformed capability ID:', capability.id);

                        capabilityId = await capabilityService.createNode(capability);
                        console.log(`✅ Auto-generated capability ${capabilityId} from feature ${validatedEntity.key}`);
                    } catch (error) {
                        console.error(`❌ Failed to auto-generate capability:`, error);
                        console.error('   Error details:', error instanceof Error ? error.message : String(error));
                    }
                } else {
                    console.warn('⚠️ Feature validation failed:', featureResult.error.errors);
                }
            } else {
                console.log(`ℹ️  Entity type "${(validatedEntity as any).type}" is not use_case or feature, skipping capability generation`);
            }
        } else {
            console.log('ℹ️  Entity does not have "type" field (might be modern CapabilityNode schema), skipping auto-generation');
        }

        console.log('📊 Final result - Capability generated:', capabilityId !== null, '| Capability ID:', capabilityId);

        res.status(201).json({
            insertedId: result.insertedId.toString(),
            capabilityGenerated: capabilityId !== null,
            capabilityId: capabilityId
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                message: 'The document does not match the required entity schema',
                details: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                    received: err.code === 'invalid_type' ? (err as any).received : undefined
                }))
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Find a document in a collection
 * Only validates request structure (no entity validation needed for queries)
 */
export async function findDocument(req: Request, res: Response) {
    try {
        const collectionName = req.query.collection as string;
        const filterStr = req.query.filter as string;

        if (!collectionName) {
            return res.status(400).json({ error: 'Collection name is required' });
        }

        const filter = filterStr ? JSON.parse(filterStr) : {};
        const validated = FindDocumentRequestSchema.parse({ collectionName, filter });

        const db = await getDb();
        const document = await db.collection(validated.collectionName).findOne(validated.filter);

        res.json({
            document: document || null,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
        } else if (error instanceof SyntaxError) {
            res.status(400).json({ error: 'Invalid filter JSON' });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Update a document in a collection
 * Requires FULL document replacement with entity validation
 * No partial updates to ensure data integrity
 * 
 * NEW: Auto-updates corresponding CapabilityNode if exists
 */
export async function updateDocument(req: Request, res: Response) {
    try {
        // 1. Validate request structure
        const { collectionName, filter, document } = UpdateDocumentRequestSchema.parse(req.body);

        // 2. Validate entity schema (feature or use_case)
        const validatedEntity = EntitySchema.parse(document);

        // 3. Replace document with validated entity (not partial update)
        const db = await getDb();
        const result = await db.collection(collectionName).replaceOne(filter, validatedEntity);

        // 4. AUTO-UPDATE CAPABILITY (if entity is UseCase or Feature)
        let capabilityUpdated = false;

        if ('type' in validatedEntity && 'key' in validatedEntity) {
            const capabilityId = `cap-${validatedEntity.key}`;

            // Check if corresponding capability exists
            const existingCapability = await capabilityService.getNode(capabilityId);

            if (existingCapability) {
                if (validatedEntity.type === 'use_case') {
                    const useCaseResult = UseCaseSchema.safeParse(validatedEntity);
                    if (useCaseResult.success) {
                        try {
                            // Use LLM-based transformation (async)
                            const updatedCapability = await transformationService.transformUseCaseToCapabilityWithIntent(
                                useCaseResult.data,
                                { generateId: false } // Keep existing ID
                            );

                            // Update capability with new data
                            await capabilityService.updateNode(capabilityId, updatedCapability);
                            capabilityUpdated = true;
                            console.log(`✅ Auto-updated capability ${capabilityId} from use case update (LLM-based)`);
                        } catch (error) {
                            console.warn(`⚠️ Failed to auto-update capability:`, error);
                        }
                    }
                } else if (validatedEntity.type === 'feature') {
                    const featureResult = FeatureSchema.safeParse(validatedEntity);
                    if (featureResult.success) {
                        const updatedCapability = transformationService.transformFeatureToCapability(featureResult.data);

                        try {
                            await capabilityService.updateNode(capabilityId, updatedCapability);
                            capabilityUpdated = true;
                            console.log(`✅ Auto-updated capability ${capabilityId} from feature update`);
                        } catch (error) {
                            console.warn(`⚠️ Failed to auto-update capability:`, error);
                        }
                    }
                }
            }
        }

        res.json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            capabilityUpdated
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                error: 'Validation error',
                message: 'The document does not match the required entity schema',
                details: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                    received: err.code === 'invalid_type' ? (err as any).received : undefined
                }))
            });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * Delete a document from a collection
 * Only validates request structure (no entity validation needed for deletions)
 * 
 * NEW: Auto-deletes corresponding CapabilityNode if exists
 */
export async function deleteDocument(req: Request, res: Response) {
    try {
        const { collectionName, filter } = DeleteDocumentRequestSchema.parse(req.body);

        const db = await getDb();

        // Get documents before deleting to check for capabilities
        const documentsToDelete = await db.collection(collectionName).find(filter).toArray();

        // Delete documents
        const result = await db.collection(collectionName).deleteMany(filter);

        // AUTO-DELETE CAPABILITIES
        let capabilitiesDeleted = 0;

        for (const doc of documentsToDelete) {
            if ('type' in doc && 'key' in doc && (doc.type === 'use_case' || doc.type === 'feature')) {
                const capabilityId = `cap-${doc.key}`;

                try {
                    const deleted = await capabilityService.deleteNode(capabilityId);
                    if (deleted) {
                        capabilitiesDeleted++;
                        console.log(`✅ Auto-deleted capability ${capabilityId}`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Failed to auto-delete capability ${capabilityId}:`, error);
                }
            }
        }

        res.json({
            deletedCount: result.deletedCount,
            capabilitiesDeleted
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: 'Validation error', details: error.errors });
        } else {
            res.status(500);
            throw error;
        }
    }
}

/**
 * List all collections in the database
 */
export async function listCollections(req: Request, res: Response) {
    try {
        const db = await getDb();
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        res.json({
            collections: collectionNames,
        });
    } catch (error) {
        res.status(500);
        throw error;
    }
}
