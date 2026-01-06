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
                console.log('✅ UseCase detected, starting LLM-based intent extraction...');

                // Transform UseCase → CapabilityNode using LLM intent extraction
                const useCaseResult = UseCaseSchema.safeParse(validatedEntity);
                console.log('   UseCase validation result:', useCaseResult.success ? 'SUCCESS' : 'FAILED');

                if (useCaseResult.success) {
                    console.log('   UseCase key:', useCaseResult.data.key);

                    try {
                        // NEW: Use LLM-based transformation
                        const capability = await transformationService.transformUseCaseToCapabilityWithIntent(useCaseResult.data);
                        console.log('   Transformed capability ID:', capability.id);
                        console.log('   Capability kind:', capability.kind);
                        console.log('   Intent confidence:', capability.intentAnalysis?.confidenceLevel);

                        capabilityId = await capabilityService.createNode(capability);
                        console.log(`✅ Auto-generated capability ${capabilityId} from use case ${validatedEntity.key}`);
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
