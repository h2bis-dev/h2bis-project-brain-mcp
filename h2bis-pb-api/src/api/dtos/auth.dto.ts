import { z } from 'zod';

// ==================== Request DTOs ====================

export const RegisterRequestDto = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required')
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
}

export interface LoginResponseDto {
    id: string;
    email: string;
    role: string[];
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
}
