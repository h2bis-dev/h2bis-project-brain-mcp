import { Router } from 'express';
import * as projectBrainSystemController from './project_brain_system.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';

const router = Router();

// ========== AGENT MCP ENDPOINTS (API Key Auth) ==========
// These endpoints are secured with API Key authentication (X-API-Key header).
// Used by MCP tools for machine-to-machine communication.

/**
 * GET /api/project-brain-system/mcp/collections
 * List all database collections (for MCP)
 */
router.get('/mcp/collections', authenticate, projectBrainSystemController.listCollections);

/**
 * POST /api/project-brain-system/mcp/find
 * Find documents in a collection (for MCP)
 */
router.post('/mcp/find', authenticate, projectBrainSystemController.findDocuments);

/**
 * POST /api/project-brain-system/mcp/insert
 * Insert a document into a collection (for MCP)
 */
router.post('/mcp/insert', authenticate, projectBrainSystemController.insertDocument);

/**
 * PUT /api/project-brain-system/mcp/update
 * Update a document in a collection (for MCP)
 */
router.put('/mcp/update', authenticate, projectBrainSystemController.updateDocument);

/**
 * DELETE /api/project-brain-system/mcp/delete
 * Delete a document from a collection (for MCP)
 */
router.delete('/mcp/delete', authenticate, projectBrainSystemController.deleteDocument);

// ========== AUTHENTICATED ENDPOINTS ==========

/**
 * GET /api/project-brain-system/collections
 * List all database collections
 */
router.get('/collections', authenticate, projectBrainSystemController.listCollections);

/**
 * POST /api/project-brain-system/find
 * Find documents in a collection
 */
router.post('/find', authenticate, projectBrainSystemController.findDocuments);

/**
 * POST /api/project-brain-system/insert
 * Insert a document into a collection
 */
router.post('/insert', authenticate, projectBrainSystemController.insertDocument);

/**
 * PUT /api/project-brain-system/update
 * Update a document in a collection
 */
router.put('/update', authenticate, projectBrainSystemController.updateDocument);

/**
 * DELETE /api/project-brain-system/delete
 * Delete a document from a collection
 */
router.delete('/delete', authenticate, projectBrainSystemController.deleteDocument);

export default router;
