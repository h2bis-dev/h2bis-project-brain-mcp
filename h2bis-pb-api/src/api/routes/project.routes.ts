import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';

const projectRouter = Router();

/**
 * POST /api/projects
 * Creates a new software development project
 * Permissions: create:project
 */
projectRouter.post(
    '/',
    authenticate,
    requirePermission('create:project'),
    projectController.createProject
);

/**
 * GET /api/projects
 * Retrieves all projects accessible to the current user
 * Permissions: view:projects
 */
projectRouter.get(
    '/',
    authenticate,
    requirePermission('view:projects'),
    projectController.getProjects
);

/**
 * GET /api/projects/:projectId
 * Retrieves a specific project with user's role and management status
 * Permissions: view:projects
 */
projectRouter.get(
    '/:projectId',
    authenticate,
    requirePermission('view:projects'),
    projectController.getProjectById
);

export default projectRouter;
