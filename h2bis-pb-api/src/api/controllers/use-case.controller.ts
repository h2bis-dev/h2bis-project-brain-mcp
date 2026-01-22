import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { getUseCasesHandler } from '../../application/handlers/use-case/get-use-cases.handler.js';
import { getUseCaseByIdHandler } from '../../application/handlers/use-case/get-use-case-by-id.handler.js';

/**
 * Get all use cases
 * GET /api/use-cases
 */
export const getAllUseCases = asyncHandler(async (req: Request, res: Response) => {
    // Execute handler
    const result = await getUseCasesHandler.execute();

    // Send response
    res.status(200).json(result);
});

/**
 * Get a single use case by ID
 * GET /api/use-cases/:id
 */
export const getUseCaseById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Execute handler
    const result = await getUseCaseByIdHandler.execute(id);

    // Send response
    res.status(200).json(result);
});
