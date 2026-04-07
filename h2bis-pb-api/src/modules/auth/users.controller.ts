import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { asyncHandler } from '../../core/middleware/error.middleware.js';
import { userRepository } from './repositories/user.repository.js';
import { hashPassword } from './services/password.service.js';
import { AdminCreateUserRequestDto } from './auth.dto.js';
import { NotFoundError } from '../../core/errors/app.error.js';

/**
 * POST /api/users
 * Admin creates a new user with an auto-generated one-time password.
 * The user is created as isActive=false + mustChangePassword=true.
 * The plaintext OTP is returned once and must be shared with the user manually.
 */
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const dto = AdminCreateUserRequestDto.parse(req.body);

    // Generate a cryptographically secure 16-character alphanumeric OTP
    const tempPassword = randomBytes(16).toString('base64url').slice(0, 16);
    const passwordHash = await hashPassword(tempPassword);

    const user = await userRepository.create({
        email: dto.email,
        name: dto.name,
        role: dto.role,
        passwordHash,
        isActive: false,
        mustChangePassword: true,
    });

    res.status(201).json({
        success: true,
        data: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            tempPassword, // Shown to admin only once — must be forwarded to the user
        },
    });
});

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

/**
 * DELETE /api/users/:id
 * Permanently delete a user account (admin only).
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userRepository.findById(req.params.id);
    if (!user) throw new NotFoundError('User not found');

    await userRepository.deleteById(req.params.id);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
});


