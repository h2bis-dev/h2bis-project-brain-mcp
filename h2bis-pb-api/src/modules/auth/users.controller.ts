import { Request, Response } from 'express';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import { userRepository } from './repositories/user.repository.js';
import { accessRequestRepository } from './repositories/access-request.repository.js';
import { NotFoundError, ValidationError } from '../../core/errors/app.error.js';

/**
 * GET /api/users
 * List all users (admin only).
 * Supports ?pending=true to filter unapproved accounts.
 */
export const listUsers = asyncHandler(async (req: Request, res: Response) => {
    const pendingOnly = req.query.pending === 'true';
    const users = pendingOnly
        ? await userRepository.findPending()
        : await userRepository.findAll();

    res.status(200).json({ success: true, data: { users } });
});

/**
 * GET /api/users/:id
 * Get a single user by ID (admin only).
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    const { passwordHash: _omit, ...safe } = (user as any).toObject();
    res.status(200).json({ success: true, data: { user: safe } });
});

/**
 * POST /api/users/:id/approve
 * Approve a pending user (admin only).
 */
export const approveUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    await userRepository.updateActiveStatus(req.params.id, true);

    res.status(200).json({ success: true, message: 'User approved successfully' });
});

/**
 * POST /api/users/:id/deactivate
 * Deactivate an active user (admin only).
 */
export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    await userRepository.updateActiveStatus(req.params.id, false);

    res.status(200).json({ success: true, message: 'User deactivated successfully' });
});

/**
 * PATCH /api/users/:id/role
 * Update a user's role (admin only).
 * Body: { role: ['user' | 'admin' | 'agent'] }
 */
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
    const { role } = req.body;
    if (!Array.isArray(role) || role.length === 0) {
        res.status(400).json({ success: false, error: 'role must be a non-empty array' });
        return;
    }

    const allowed = ['user', 'admin', 'agent'];
    if (!role.every((r: string) => allowed.includes(r))) {
        res.status(400).json({ success: false, error: `role values must be one of: ${allowed.join(', ')}` });
        return;
    }

    const user = await userRepository.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: 'User role updated', data: { role: user.role } });
});

// ==================== Access Request Management ====================

/**
 * GET /api/users/access-requests
 * List access requests (admin only).
 * Supports ?status=pending|approved|rejected
 */
export const listAccessRequests = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status as string | undefined;
    const requests = await accessRequestRepository.findAll(status ? { status } : {});
    res.status(200).json({ success: true, data: { accessRequests: requests } });
});

/**
 * POST /api/users/access-requests/:id/approve
 * Approve an access request (admin only).
 * Creates the user account and marks the request as approved.
 */
export const approveAccessRequest = asyncHandler(async (req: Request, res: Response) => {
    const request = await accessRequestRepository.findById(req.params.id);
    if (!request) throw new NotFoundError('Access request not found');

    if (request.status !== 'pending') {
        throw new ValidationError(`Request has already been ${request.status}`);
    }

    // Check if user already exists (edge case: registered manually while request pending)
    let user = await userRepository.findByEmail(request.email)
        || await userRepository.findByGithubId(request.githubId);

    if (!user) {
        // Create the user account
        user = await userRepository.create({
            email: request.email,
            name: request.name,
            role: ['user'],
            isActive: true,
            githubId: request.githubId,
        });
    } else if (!user.isActive) {
        // User exists but inactive — activate them
        await userRepository.updateActiveStatus(user._id.toString(), true);
    }

    const adminUser = (req as any).user;
    await accessRequestRepository.updateStatus(
        req.params.id,
        'approved',
        adminUser.userId,
        req.body.note
    );

    res.status(200).json({
        success: true,
        message: 'Access request approved and user account created',
        data: { userId: user._id.toString() },
    });
});

/**
 * POST /api/users/access-requests/:id/reject
 * Reject an access request (admin only).
 */
export const rejectAccessRequest = asyncHandler(async (req: Request, res: Response) => {
    const request = await accessRequestRepository.findById(req.params.id);
    if (!request) throw new NotFoundError('Access request not found');

    if (request.status !== 'pending') {
        throw new ValidationError(`Request has already been ${request.status}`);
    }

    const adminUser = (req as any).user;
    await accessRequestRepository.updateStatus(
        req.params.id,
        'rejected',
        adminUser.userId,
        req.body.note
    );

    res.status(200).json({ success: true, message: 'Access request rejected' });
});
