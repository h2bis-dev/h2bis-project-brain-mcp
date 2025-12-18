import { Request, Response } from 'express';
import { getDb } from '../db.js';
import { z } from 'zod';

// Validation schemas
const insertDocumentSchema = z.object({
    collectionName: z.string().min(1),
    document: z.record(z.any()),
});

const findDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.record(z.any()).optional().default({}),
});

const updateDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.record(z.any()),
    update: z.record(z.any()),
});

const deleteDocumentSchema = z.object({
    collectionName: z.string().min(1),
    filter: z.record(z.any()),
});

/**
 * Insert a document into a collection
 */
export async function insertDocument(req: Request, res: Response) {
    try {
        const { collectionName, document } = insertDocumentSchema.parse(req.body);

        const db = await getDb();
        const result = await db.collection(collectionName).insertOne(document);

        res.status(201).json({
            insertedId: result.insertedId.toString(),
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
 * Find a document in a collection
 */
export async function findDocument(req: Request, res: Response) {
    try {
        const collectionName = req.query.collection as string;
        const filterStr = req.query.filter as string;

        if (!collectionName) {
            return res.status(400).json({ error: 'Collection name is required' });
        }

        const filter = filterStr ? JSON.parse(filterStr) : {};
        const validated = findDocumentSchema.parse({ collectionName, filter });

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
 */
export async function updateDocument(req: Request, res: Response) {
    try {
        const { collectionName, filter, update } = updateDocumentSchema.parse(req.body);

        const db = await getDb();
        const result = await db.collection(collectionName).updateMany(filter, update);

        res.json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
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
 * Delete a document from a collection
 */
export async function deleteDocument(req: Request, res: Response) {
    try {
        const { collectionName, filter } = deleteDocumentSchema.parse(req.body);

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
