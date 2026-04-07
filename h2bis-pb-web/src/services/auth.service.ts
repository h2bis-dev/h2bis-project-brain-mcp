import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type {
    LoginRequest,
    AuthResponse,
    ChangePasswordRequest,
} from '@/types/auth.types';

/**
 * Auth Service
 * Handles all authentication-related API calls.
 * Note: User registration is admin-only via userService.createUser().
 */
export const authService = {
    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
        return (response as any)?.data as AuthResponse;
    },

    /**
     * Change password (first-login or regular change).
     * Requires an active session.
     */
    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
};
