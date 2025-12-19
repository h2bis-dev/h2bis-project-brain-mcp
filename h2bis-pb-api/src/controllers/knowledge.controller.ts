import { Request, Response } from 'express';
import { getDb } from '../db.js';
import { z } from 'zod';
import { EntitySchema } from '../db_schema/entity_schema.js';
import {
    InsertDocumentRequestSchema,
    FindDocumentRequestSchema,
    UpdateDocumentRequestSchema,
    DeleteDocumentRequestSchema
} from '../validation/request.schemas.js';

/**
 * Insert a document into a collection
 * Validates both request structure AND entity schema
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

        res.status(201).json({
            insertedId: result.insertedId.toString(),
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

        res.json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
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
 */
export async function deleteDocument(req: Request, res: Response) {
    try {
        const { collectionName, filter } = DeleteDocumentRequestSchema.parse(req.body);

        const db = await getDb();
        const result = await db.collection(collectionName).deleteMany(filter);

        res.json({
            deletedCount: result.deletedCount,
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
