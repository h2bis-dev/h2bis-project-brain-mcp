import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { User } from '@/types/auth.types';

export const userService = {
    getPendingUsers: async (): Promise<User[]> => {
        const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}?pending=true`);
        return (response?.data?.data?.users || []) as User[];
    },

    approveUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.APPROVE(userId));
    },

    rejectUser: async (userId: string): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.USERS.DEACTIVATE(userId));
    },
};
