import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/auth/users.routes.js';
import capabilityRoutes from './modules/capability/capability.routes.js';
import useCaseRoutes from './modules/use-case/use-case.routes.js';
import projectRoutes from './modules/project/project.routes.js';
import projectBrainSystemRoutes from './modules/project_brain_system/project_brain_system.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/capabilities', capabilityRoutes);
router.use('/use-cases', useCaseRoutes);
router.use('/projects', projectRoutes);
router.use('/project-brain-system', projectBrainSystemRoutes);

export default router;
