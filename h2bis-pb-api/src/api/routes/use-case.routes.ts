import { Router } from 'express';
import * as useCaseController from '../controllers/use-case.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All use case routes require authentication
// Permission 'view:use-case' is available to user, moderator, and admin roles

// GET /api/use-cases - Get all use cases
router.get('/', authenticate, useCaseController.getAllUseCases);

// GET /api/use-cases/:id - Get a single use case by ID
router.get('/:id', authenticate, useCaseController.getUseCaseById);

export default router;
