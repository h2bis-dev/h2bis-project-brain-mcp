import { Router } from 'express';
import * as useCaseController from '../controllers/use-case.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All use case routes require authentication
// 'view:use-case' permission: user, moderator, admin
// 'create:use-case' permission: user, moderator, admin

// GET /api/use-cases - Get all use cases
router.get('/', authenticate, useCaseController.getAllUseCases);

// POST /api/use-cases - Create a new use case
router.post('/', authenticate, useCaseController.createUseCase);

// GET /api/use-cases/:id - Get a single use case by ID
router.get('/:id', authenticate, useCaseController.getUseCaseById);

export default router;
