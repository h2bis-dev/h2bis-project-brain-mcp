import { z } from 'zod';

// ==================== Request DTOs ====================

/**
 * Admin-only: create a new user (no password — OTP is auto-generated).
 */
export const AdminCreateUserRequestDto = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(1, 'Name is required'),
    role: z.array(z.enum(['user', 'admin', 'agent'])).min(1, 'Role is required'),
});

export type AdminCreateUserRequestDto = z.infer<typeof AdminCreateUserRequestDto>;

/**
 * @deprecated Public self-registration has been removed.
 * Kept temporarily for any internal callers during migration.
 */
export const RegisterRequestDto = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.array(z.enum(['user', 'admin', 'agent'])).min(1, 'Role is required')
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestDto>;

export const LoginRequestDto = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export type LoginRequestDto = z.infer<typeof LoginRequestDto>;

// ==================== Response DTOs ====================

export interface RegisterResponseDto {
    id: string;
    email: string;
    role: string[];
}

/** Returned to the admin after creating a new user. tempPassword is shown only once. */
export interface AdminCreateUserResponseDto {
    id: string;
    email: string;
    name: string;
    role: string[];
    tempPassword: string;
}

export interface LoginResponseDto {
    id: string;
    email: string;
    role: string[];
    permissions: string[];
    isActive: boolean;
    /** True when the user must set a new password on first login. */
    mustChangePassword: boolean;
    accessToken: string;
    refreshToken: string;
}

// ==================== Refresh Token DTOs ====================

export const RefreshRequestDto = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

export type RefreshRequestDto = z.infer<typeof RefreshRequestDto>;

export interface RefreshResponseDto {
    accessToken: string;
    refreshToken: string;
}

// ==================== Change Password DTOs ====================

export const ChangePasswordRequestDto = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export type ChangePasswordRequestDto = z.infer<typeof ChangePasswordRequestDto>;

// ==================== Logout DTOs ====================

export const LogoutRequestDto = z.object({
    refreshToken: z.string().optional()
});

export type LogoutRequestDto = z.infer<typeof LogoutRequestDto>;

// ==================== API Key DTOs ====================

export const CreateApiKeyRequestDto = z.object({
    userId: z.string().min(1, 'User ID is required'),
    name: z.string().min(3, 'Name must be at least 3 characters').max(100),
    scopes: z.array(z.enum(['read', 'write', 'delete', 'admin'])).min(1, 'At least one scope is required'),
    expiresInDays: z.number().int().positive().optional(), // Optional expiration in days
    description: z.string().max(500).optional(),
});

export type CreateApiKeyRequestDto = z.infer<typeof CreateApiKeyRequestDto>;

export interface CreateApiKeyResponseDto {
    key: string;      // Plaintext key (shown only once!)
    keyId: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    expiresAt: string | null;
    message: string;  // Warning about key visibility
}

export interface ApiKeyListItemDto {
    id: string;
    keyPrefix: string;
    name: string;
    scopes: string[];
    userId: string;
    userEmail?: string;
    userName?: string;
    expiresAt: string | null;
    lastUsedAt: string | null;
    isActive: boolean;
    createdAt: string;
    createdBy?: string;
}

export interface ListApiKeysResponseDto {
    keys: ApiKeyListItemDto[];
    total: number;
}
