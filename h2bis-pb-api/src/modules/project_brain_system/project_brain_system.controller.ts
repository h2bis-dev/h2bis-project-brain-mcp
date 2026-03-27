import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import {
    ListCollectionsRequestDto,
    FindDocumentRequestDto,
    InsertDocumentRequestDto,
    UpdateDocumentRequestDto,
    DeleteDocumentRequestDto
} from './project_brain_system.dto.js';
import { listCollectionsHandler } from './handlers/list-collections.handler.js';
import { findDocumentsHandler } from './handlers/find-documents.handler.js';
import { insertDocumentHandler } from './handlers/insert-document.handler.js';
import { updateDocumentHandler } from './handlers/update-document.handler.js';
import { deleteDocumentHandler } from './handlers/delete-document.handler.js';

/**
 * List all collections
 * GET /api/project-brain-system/collections
 */
export const listCollections = asyncHandler(async (req: Request, res: Response) => {
    const dto = ListCollectionsRequestDto.parse(req.query);
    
    const result = await listCollectionsHandler.execute(dto.includeSystem);
    
    res.json({
        success: true,
        data: result
    });
});

/**
 * Find documents in a collection
 * POST /api/project-brain-system/find
 */
export const findDocuments = asyncHandler(async (req: Request, res: Response) => {
    const dto = FindDocumentRequestDto.parse(req.body);
    
    const result = await findDocumentsHandler.execute(dto);
    
    res.json({
        success: true,
        data: result
    });
});

/**
 * Insert a document into a collection
 * POST /api/project-brain-system/insert
 */
export const insertDocument = asyncHandler(async (req: Request, res: Response) => {
    const dto = InsertDocumentRequestDto.parse(req.body);
    
    const result = await insertDocumentHandler.execute(dto);
    
    res.status(201).json({
        success: true,
        data: result
    });
});

/**
 * Update a document in a collection
 * PUT /api/project-brain-system/update
 */
export const updateDocument = asyncHandler(async (req: Request, res: Response) => {
    const dto = UpdateDocumentRequestDto.parse(req.body);
    
    const result = await updateDocumentHandler.execute(dto);
    
    res.json({
        success: true,
        data: result
    });
});

/**
 * Delete a document from a collection
 * DELETE /api/project-brain-system/delete
 */
export const deleteDocument = asyncHandler(async (req: Request, res: Response) => {
    const dto = DeleteDocumentRequestDto.parse(req.body);
    
    const result = await deleteDocumentHandler.execute(dto);
    
    res.json({
        success: true,
        data: result
    });
});
