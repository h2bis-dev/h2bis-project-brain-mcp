import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { User, AdminCreateUserRequest, AdminCreateUserResponse } from '@/types/auth.types';

export const userService = {
    listAllUsers: async (): Promise<User[]> => {
        const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}`);
        // API: { success, data: { users: [...] } }  →  axios wraps in response.data
        return ((response as any)?.data?.data?.users || []) as User[];
    },

    createUser: async (data: AdminCreateUserRequest): Promise<AdminCreateUserResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, data);
        // API: { success, data: { id, email, name, role, tempPassword } }
        return (response as any)?.data?.data as AdminCreateUserResponse;
    },

    approveUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.APPROVE(userId));
    },

    deactivateUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.DEACTIVATE(userId));
    },

    deleteUser: async (userId: string): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.USERS.DELETE(userId));
    },
};
