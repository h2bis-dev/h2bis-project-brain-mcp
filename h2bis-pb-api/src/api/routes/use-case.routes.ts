import { Router } from 'express';
import * as useCaseController from '../controllers/use-case.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';
import { PERMISSIONS } from '../../domain/services/authorization.service.js';

const router = Router();

// All use case routes require authentication
// 'view:use-case' permission: user, moderator, admin
// 'create:use-case' permission: user, moderator, admin
// 'delete:use-case' permission: moderator, admin ONLY

// GET /api/use-cases - Get all use cases
router.get('/', authenticate, useCaseController.getAllUseCases);

// POST /api/use-cases - Create a new use case
router.post('/', authenticate, useCaseController.createUseCase);

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
