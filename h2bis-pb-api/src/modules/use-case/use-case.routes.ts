import { Router } from 'express';
import * as useCaseController from './use-case.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { requirePermission } from '../../core/middleware/permission.middleware.js';
import { PERMISSIONS } from '../auth/services/authorization.service.js';

const router = Router();

// ========== AGENT MCP ENDPOINTS (API Key Auth) ==========
// These endpoints are secured with API Key authentication (X-API-Key header).
// Used by MCP tools for machine-to-machine communication.

// GET /api/use-cases/mcp/list - List all use cases (for MCP)
router.get('/mcp/list', authenticate, useCaseController.getAllUseCases);

// GET /api/use-cases/mcp/find/:id - Find by ID (for MCP)
router.get('/mcp/find/:id', authenticate, useCaseController.getUseCaseById);

// POST /api/use-cases/mcp/create - Create use case (for MCP)
router.post('/mcp/create', authenticate, useCaseController.createUseCase);

// DELETE /api/use-cases/mcp/delete/:id - Delete use case (for MCP)
router.delete('/mcp/delete/:id', authenticate, useCaseController.deleteUseCase);

// PUT /api/use-cases/mcp/update/:id - Update use case (for MCP)
router.put('/mcp/update/:id', authenticate, useCaseController.updateUseCase);

// POST /api/use-cases/mcp/enhance - Enhance use case with AI (for MCP)
router.post('/mcp/enhance', authenticate, useCaseController.enhanceUseCase);

// POST /api/use-cases/mcp/update-with-ai - Update use case with AI (for MCP)
router.post('/mcp/update-with-ai', authenticate, useCaseController.updateUseCaseWithAI);

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

// POST /api/use-cases/enhance - Enhance use case with AI
router.post('/enhance', authenticate, useCaseController.enhanceUseCase);

// POST /api/use-cases/update-with-ai - Update use case with AI (project-context-aware)
router.post('/update-with-ai', authenticate, useCaseController.updateUseCaseWithAI);

// GET /api/use-cases/:id - Get a single use case by ID
router.get('/:id', authenticate, useCaseController.getUseCaseById);

// PUT /api/use-cases/:id - Update a use case
router.put(
    '/:id',
    authenticate,
    requirePermission(PERMISSIONS.USE_CASE.EDIT),
    useCaseController.updateUseCase
);

// DELETE /api/use-cases/:id - Delete a use case (admin/moderator only)
router.delete(
    '/:id',
    authenticate,
    requirePermission(PERMISSIONS.USE_CASE.DELETE),
    useCaseController.deleteUseCase
);

export default router;
