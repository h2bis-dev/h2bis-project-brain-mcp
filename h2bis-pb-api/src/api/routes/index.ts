import { Router } from 'express';
import authRoutes from './auth.routes.js';
import capabilityRoutes from './capability.routes.js';
import useCaseRoutes from './use-case.routes.js';
import projectRoutes from './project.routes.js';

const router = Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/capabilities', capabilityRoutes);
router.use('/use-cases', useCaseRoutes);
router.use('/projects', projectRoutes);

export default router;
