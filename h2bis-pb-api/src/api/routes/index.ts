import { Router } from 'express';
import authRoutes from './auth.routes.js';
import knowledgeRoutes from './knowledge.routes.js';
import capabilityRoutes from './capability.routes.js';

const router = Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/capabilities', capabilityRoutes);

export default router;
