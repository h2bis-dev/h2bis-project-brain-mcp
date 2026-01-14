import { apiClient } from './api/client';
import { API_ENDPOINTS } from '@/lib/config';
import type {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    RegisterResponse
} from '@/types/auth.types';

/**
 * Auth Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return apiClient.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    },

    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    },
};
