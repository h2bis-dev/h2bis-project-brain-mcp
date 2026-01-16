import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import {
    InsertDocumentRequestDto,
    FindDocumentRequestDto,
    UpdateDocumentRequestDto,
    DeleteDocumentRequestDto
} from '../dtos/knowledge.dto.js';
import { insertDocumentHandler } from '../../application/handlers/knowledge/insert-document.handler.js';
import { findDocumentHandler } from '../../application/handlers/knowledge/find-document.handler.js';
import { updateDocumentHandler } from '../../application/handlers/knowledge/update-document.handler.js';
import { deleteDocumentHandler } from '../../application/handlers/knowledge/delete-document.handler.js';
import { listCollectionsHandler } from '../../application/handlers/knowledge/list-collections.handler.js';

/**
 * Insert a document into a collection
 * POST /api/knowledge
 */
export const insertDocument = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = InsertDocumentRequestDto.parse(req.body);

    // Execute use case
    const result = await insertDocumentHandler.execute(dto.collectionName, dto.document);

    // Handle rejection cases with appropriate status codes
    if (result.mode === 'REJECTED' && result.insufficiencyReport) {
        return res.status(400).json(result);
    }

    if (result.mode === 'REJECTED' && result.validationReport) {
        return res.status(400).json(result);
    }

    // Success
    res.status(201).json(result);
});

/**
 * Find a document in a collection
 * GET /api/knowledge?collection=<name>&filter=<json>
 */
export const findDocument = asyncHandler(async (req: Request, res: Response) => {
    const collectionName = req.query.collection as string;
    const filterStr = req.query.filter as string;

    if (!collectionName) {
        return res.status(400).json({ error: 'Collection name is required' });
    }

    const filter = filterStr ? JSON.parse(filterStr) : {};

    // Validate request DTO
    const dto = FindDocumentRequestDto.parse({ collectionName, filter });

    // Execute use case
    const result = await findDocumentHandler.execute(dto.collectionName, dto.filter);

    res.status(200).json(result);
});

/**
 * Update a document in a collection
 * PUT /api/knowledge
 */
export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = UpdateDocumentRequestDto.parse(req.body);

    // Execute use case
    const result = await updateDocumentHandler.execute(
        dto.collectionName,
        dto.filter,
        dto.document
    );

    res.status(200).json(result);
});

/**
 * Delete documents from a collection
 * DELETE /api/knowledge
 */
export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = DeleteDocumentRequestDto.parse(req.body);

    // Execute use case
    const result = await deleteDocumentHandler.execute(dto.collectionName, dto.filter);

    res.status(200).json(result);
});

/**
 * List all collections in the database
 * GET /api/knowledge/collections
 */
export const listCollections = asyncHandler(async (req: Request, res: Response) => {
    // Execute use case
    const result = await listCollectionsHandler.execute();

    res.status(200).json(result);
});
