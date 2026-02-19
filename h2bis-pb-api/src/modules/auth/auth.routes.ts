import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { requirePermission } from '../../core/middleware/permission.middleware.js';
import { PERMISSIONS } from './services/authorization.service.js';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout - Logout user (revoke refresh token)
router.post('/logout', authController.logout);

// ==================== API Key Management Routes ====================

// POST /api/auth/api-keys - Create new API key (admin only)
router.post(
    '/api-keys',
    authenticate,
    requirePermission(PERMISSIONS.SYSTEM.MANAGE_SETTINGS),
    authController.createApiKey
);

// GET /api/auth/api-keys - List API keys (admin sees all, users see own)
router.get(
    '/api-keys',
    authenticate,
    authController.listApiKeys
);

// POST /api/auth/api-keys/:id/revoke - Revoke an API key
router.post(
    '/api-keys/:id/revoke',
    authenticate,
    authController.revokeApiKey
);

// DELETE /api/auth/api-keys/:id - Delete an API key permanently
router.delete(
    '/api-keys/:id',
    authenticate,
    authController.deleteApiKey
);

export default router;
