import { Router } from 'express';
import * as useCaseController from '../controllers/use-case.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';
import { PERMISSIONS } from '../../domain/services/authorization.service.js';

const router = Router();

// ========== PUBLIC MCP ENDPOINTS (No Auth) ==========
// These endpoints are for MCP server access only

// GET /api/use-cases/mcp/list - List all use cases (for MCP)
router.get('/mcp/list', useCaseController.getAllUseCases);

// GET /api/use-cases/mcp/find/:id - Find by ID (for MCP)
router.get('/mcp/find/:id', useCaseController.getUseCaseById);

// POST /api/use-cases/mcp/create - Create use case (for MCP)
router.post('/mcp/create', useCaseController.createUseCase);

// DELETE /api/use-cases/mcp/delete/:id - Delete use case (for MCP)
router.delete('/mcp/delete/:id', useCaseController.deleteUseCase);

// ========== AUTHENTICATED ENDPOINTS ==========

// All use case routes require authentication
// 'view:use-case' permission: user, moderator, admin
// 'create:use-case' permission: user, moderator, admin
// 'delete:use-case' permission: moderator, admin ONLY

// GET /api/use-cases - Get all use cases
router.get('/', authenticate, useCaseController.getAllUseCases);

// POST /api/use-cases - Create a new use case
router.post('/', authenticate, useCaseController.createUseCase);

// POST /api/use-cases/generate - Generate use case from description (AI)
router.post('/generate', authenticate, useCaseController.generateUseCase);

// GET /api/use-cases/:id - Get a single use case by ID
router.get('/:id', authenticate, useCaseController.getUseCaseById);

// DELETE /api/use-cases/:id - Delete a use case (admin/moderator only)
router.delete(
    '/:id',
    authenticate,
    requirePermission(PERMISSIONS.USE_CASE.DELETE),
    useCaseController.deleteUseCase
);

export default router;
