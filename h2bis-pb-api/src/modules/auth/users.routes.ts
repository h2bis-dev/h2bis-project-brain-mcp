import { Router } from 'express';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { requirePermission } from '../../core/middleware/permission.middleware.js';
import { PERMISSIONS } from './services/authorization.service.js';
import * as usersController from './users.controller.js';

const router = Router();

// All user-management routes require authentication + admin permission

// ==================== User Management Routes ====================

// POST /api/users  — admin creates a new user (no password — OTP auto-generated)
router.post(
    '/',
    authenticate,
    requirePermission(PERMISSIONS.USERS.CREATE),
    usersController.createUser
);

// GET /api/users?pending=true  — list all users (or pending-only)
router.get(
    '/',
    authenticate,
    requirePermission(PERMISSIONS.USERS.VIEW_ALL),
    usersController.listUsers
);

// GET /api/users/:id
router.get(
    '/:id',
    authenticate,
    requirePermission(PERMISSIONS.USERS.VIEW_ALL),
    usersController.getUserById
);

// POST /api/users/:id/approve  — approve a pending user
router.post(
    '/:id/approve',
    authenticate,
    requirePermission(PERMISSIONS.USERS.APPROVE),
    usersController.approveUser
);

// POST /api/users/:id/deactivate  — deactivate an active user
router.post(
    '/:id/deactivate',
    authenticate,
    requirePermission(PERMISSIONS.USERS.UPDATE_ANY),
    usersController.deactivateUser
);

// PATCH /api/users/:id/role  — change user role
router.patch(
    '/:id/role',
    authenticate,
    requirePermission(PERMISSIONS.USERS.UPDATE_ANY),
    usersController.updateUserRole
);

// DELETE /api/users/:id  — permanently delete a user
router.delete(
    '/:id',
    authenticate,
    requirePermission(PERMISSIONS.USERS.DELETE_ANY),
    usersController.deleteUser
);

export default router;
