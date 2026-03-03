import { Router } from 'express';
import { projectController } from './project.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { requirePermission } from '../../core/middleware/permission.middleware.js';

const projectRouter = Router();

// ========== AGENT MCP ENDPOINTS (API Key Auth) ==========
// These endpoints are secured with API Key authentication (X-API-Key header).
// Used by MCP tools for machine-to-machine communication.

// GET /api/projects/mcp/list - List all projects (for MCP)
projectRouter.get('/mcp/list', authenticate, projectController.getProjects);

// GET /api/projects/mcp/find/:projectId - Find project by ID (for MCP)
projectRouter.get('/mcp/find/:projectId', authenticate, projectController.getProjectById);

// POST /api/projects/mcp/create - Create project (for MCP)
projectRouter.post('/mcp/create', authenticate, projectController.createProject);

// ── Domain Catalog (MCP) ─────────────────────────────────────────────────────

// GET /api/projects/mcp/domain-catalog/:projectId - Get all domain models for a project
projectRouter.get('/mcp/domain-catalog/:projectId', authenticate, projectController.getDomainCatalog);

// PUT /api/projects/mcp/domain-catalog/:projectId - Add or replace a domain model
projectRouter.put('/mcp/domain-catalog/:projectId', authenticate, projectController.upsertDomainModel);

// DELETE /api/projects/mcp/domain-catalog/:projectId/:modelName - Remove a domain model by name
projectRouter.delete('/mcp/domain-catalog/:projectId/:modelName', authenticate, projectController.removeDomainModel);

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

/**
 * PUT /api/projects/:projectId
 * Updates an existing project
 * Permissions: edit:project
 */
projectRouter.put(
    '/:projectId',
    authenticate,
    requirePermission('edit:project'),
    projectController.updateProject
);

/**
 * DELETE /api/projects/:projectId
 * Soft-deletes a project that is in 'planning' lifecycle stage
 * Permissions: delete:project (admin only)
 */
projectRouter.delete(
    '/:projectId',
    authenticate,
    requirePermission('delete:project'),
    projectController.deleteProject
);

export default projectRouter;
