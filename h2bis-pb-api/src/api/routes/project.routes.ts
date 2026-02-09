import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permission.middleware.js';

const projectRouter = Router();

// ========== PUBLIC MCP ENDPOINTS (No Auth) ==========

// GET /api/projects/mcp/list - List all projects (for MCP)
projectRouter.get('/mcp/list', projectController.getProjects);

// GET /api/projects/mcp/find/:projectId - Find project by ID (for MCP)
projectRouter.get('/mcp/find/:projectId', projectController.getProjectById);

// POST /api/projects/mcp/create - Create project (for MCP)
projectRouter.post('/mcp/create', projectController.createProject);

// ========== AUTHENTICATED ENDPOINTS ==========

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
 * GET /api/projects/dashboard
 * Retrieves dashboard statistics with all accessible projects and their use case counts
 * Permissions: view:projects
 */
projectRouter.get(
    '/dashboard',
    authenticate,
    requirePermission('view:projects'),
    projectController.getDashboardStats
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
