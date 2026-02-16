import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import { CreateUseCaseRequestDto, UpdateUseCaseRequestDto, GenerateUseCaseRequestDto, EnhanceUseCaseRequestDto, UpdateWithAIRequestDto } from './use-case.dto.js';
import { getUseCasesHandler } from './handlers/get-use-cases.handler.js';
import { getUseCaseByIdHandler } from './handlers/get-use-case-by-id.handler.js';
import { createUseCaseHandler } from './handlers/create-use-case.handler.js';
import { updateUseCaseHandler } from './handlers/update-use-case.handler.js';
import { deleteUseCaseHandler } from './handlers/delete-use-case.handler.js';
import { generateUseCaseHandler } from './handlers/generate-use-case.handler.js';
import { enhanceUseCaseHandler } from './handlers/enhance-use-case.handler.js';
import { updateWithAIHandler } from './handlers/update-with-ai.handler.js';

/**
 * Get all use cases
 * GET /api/use-cases
 * GET /api/use-cases?projectId=<id> - Filter by project
 */
export const getAllUseCases = asyncHandler(async (req: Request, res: Response) => {
    // Extract optional projectId filter from query parameters
    const projectId = req.query.projectId as string | undefined;

    // Execute handler with optional project filter
    const result = await getUseCasesHandler.execute(projectId);

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

/**
 * Create a new use case
 * POST /api/use-cases
 */
export const createUseCase = asyncHandler(async (req: Request, res: Response) => {
    // Validate and parse DTO
    const dto = CreateUseCaseRequestDto.parse(req.body);

    // Get user ID from authenticated request
    const userId = (req as any).user?.userId;

    // Execute handler
    const result = await createUseCaseHandler.execute(dto, userId);

    // Handle rejection cases with appropriate status codes
    if (result.mode === 'REJECTED') {
        return res.status(400).json(result);
    }
    // Send response
    res.status(201).json(result);
});

/**
 * Update an existing use case
 * PUT /api/use-cases/:id
 */
export const updateUseCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate and parse DTO (partial - all fields optional)
    const dto = UpdateUseCaseRequestDto.parse(req.body);

    // Get user ID from authenticated request
    const userId = (req as any).user?.userId;

    // Execute handler
    const result = await updateUseCaseHandler.execute(id, dto, userId);

    // Send response
    res.status(200).json(result);
});

/**
 * Generate a use case structure from description (AI)
 * POST /api/use-cases/generate
 */
export const generateUseCase = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = GenerateUseCaseRequestDto.parse(req.body);

    // Execute handler
    const result = await generateUseCaseHandler.execute(dto);

    // Send response
    res.status(200).json(result);
});

/**
 * Enhance an existing use case with AI
 * POST /api/use-cases/enhance
 */
export const enhanceUseCase = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = EnhanceUseCaseRequestDto.parse(req.body);

    // Execute handler
    const result = await enhanceUseCaseHandler.execute(dto);

    // Send response
    res.status(200).json(result);
});

/**
 * Update a use case with AI (project-context-aware)
 * POST /api/use-cases/update-with-ai
 */
export const updateUseCaseWithAI = asyncHandler(async (req: Request, res: Response) => {
    // Validate request DTO
    const dto = UpdateWithAIRequestDto.parse(req.body);

    // Execute handler
    const result = await updateWithAIHandler.execute(dto);

    // Send response
    res.status(200).json(result);
});

/**
 * Delete a use case (admin only)
 * DELETE /api/use-cases/:id
 */
export const deleteUseCase = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Execute handler
    const result = await deleteUseCaseHandler.execute(id);

    // Send response
    res.status(200).json(result);
});
