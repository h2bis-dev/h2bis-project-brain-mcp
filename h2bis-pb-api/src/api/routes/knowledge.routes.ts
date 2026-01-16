import { Router } from 'express';
import * as knowledgeController from '../controllers/knowledge.controller.js';

const router = Router();

// POST /api/knowledge - Insert document
router.post('/', knowledgeController.insertDocument);

// GET /api/knowledge?collection=<name>&filter=<json> - Find document
router.get('/', knowledgeController.findDocument);

// PUT /api/knowledge - Update document
router.put('/', knowledgeController.updateDocument);

// DELETE /api/knowledge - Delete document
router.delete('/', knowledgeController.deleteDocument);

// GET /api/knowledge/collections - List all collections
router.get('/collections', knowledgeController.listCollections);

export default router;
