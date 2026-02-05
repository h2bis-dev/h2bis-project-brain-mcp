import { Router } from 'express';
import * as capabilityController from '../controllers/capability.controller.js';

const router = Router();

// ========== PUBLIC ENDPOINTS (No Auth - Available for MCP) ==========

// Basic CRUD
router.post('/', capabilityController.createCapability);
router.get('/:id', capabilityController.getCapability);
router.put('/:id', capabilityController.updateCapability);
router.delete('/:id', capabilityController.deleteCapability);

// Dependency Management
router.get('/:id/dependencies', capabilityController.getDependencies);
router.get('/:id/dependents', capabilityController.getDependents);
router.get('/:id/circular', capabilityController.detectCircular);
router.post('/order', capabilityController.getImplementationOrder);

// Impact Analysis
router.get('/:id/impact', capabilityController.analyzeImpact);

// LLM Helpers
router.get('/:id/full-context', capabilityController.getFullContext);
router.post('/:id/link-artifact', capabilityController.linkArtifact);
router.get('/by-file/:filepath', capabilityController.findByFile);

export default router;
