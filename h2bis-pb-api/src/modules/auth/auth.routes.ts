import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authenticate } from '../../core/middleware/auth.middleware.js';

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

export default router;
