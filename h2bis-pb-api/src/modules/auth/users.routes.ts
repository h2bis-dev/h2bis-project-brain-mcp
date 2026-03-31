import { Router } from 'express';
import { authenticate } from '../../core/middleware/auth.middleware.js';
import { requirePermission } from '../../core/middleware/permission.middleware.js';
import { PERMISSIONS } from './services/authorization.service.js';
import * as usersController from './users.controller.js';

const router = Router();

// All user-management routes require authentication + admin permission

// ==================== Access Request Routes ====================
// These MUST come before /:id routes to avoid Express matching "access-requests" as an :id param

// GET /api/users/access-requests?status=pending
router.get(
    '/access-requests',
    authenticate,
    requirePermission(PERMISSIONS.USERS.APPROVE),
    usersController.listAccessRequests
);

// POST /api/users/access-requests/:id/approve
router.post(
    '/access-requests/:id/approve',
    authenticate,
    requirePermission(PERMISSIONS.USERS.APPROVE),
    usersController.approveAccessRequest
);

// POST /api/users/access-requests/:id/reject
router.post(
    '/access-requests/:id/reject',
    authenticate,
    requirePermission(PERMISSIONS.USERS.APPROVE),
    usersController.rejectAccessRequest
);

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

export default router;
