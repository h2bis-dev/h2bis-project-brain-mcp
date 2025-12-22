import { Router } from 'express';
import {
    createCapability,
    getCapability,
    updateCapability,
    deleteCapability,
    getDependencies,
    getDependents,
    detectCircular,
    analyzeImpact,
    getImplementationOrder,
    getFullContext,
    linkArtifact,
    findByFile
} from '../controllers/capability.controller.js';

const router = Router();

// CRUD operations
router.post('/', createCapability);
router.get('/:id', getCapability);
router.put('/:id', updateCapability);
router.delete('/:id', deleteCapability);

// Graph operations
router.get('/:id/dependencies', getDependencies);
router.get('/:id/dependents', getDependents);
router.get('/:id/circular', detectCircular);
router.get('/:id/impact', analyzeImpact);
router.post('/order', getImplementationOrder);

// LLM helper endpoints
router.get('/:id/full-context', getFullContext);
router.post('/:id/link-artifact', linkArtifact);
router.get('/by-file/:filepath', findByFile);

export default router;
