import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { User, AdminCreateUserRequest, AdminCreateUserResponse } from '@/types/auth.types';

export const userService = {
    listAllUsers: async (): Promise<User[]> => {
        const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}`);
        return ((response as any)?.data?.users || []) as User[];
    },

    getPendingUsers: async (): Promise<User[]> => {
        const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}?pending=true`);
        return ((response as any)?.data?.users || []) as User[];
    },

    createUser: async (data: AdminCreateUserRequest): Promise<AdminCreateUserResponse> => {
        const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, data);
        return (response as any)?.data as AdminCreateUserResponse;
    },

    approveUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.APPROVE(userId));
    },

    deactivateUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.DEACTIVATE(userId));
    },
};
