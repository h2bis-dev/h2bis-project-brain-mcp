import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';

export interface DashboardProject {
    _id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'deleted';
    useCaseCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStatsResponse {
    success: boolean;
    data: {
        projects: DashboardProject[];
    };
}

/**
 * Get dashboard statistics
 * Returns all accessible projects with their use case counts
 */
export async function getDashboardStats(): Promise<DashboardProject[]> {
    const response = await apiClient.get<DashboardStatsResponse>(
        API_ENDPOINTS.PROJECTS.DASHBOARD
    );
    return response.data.data.projects;
}
