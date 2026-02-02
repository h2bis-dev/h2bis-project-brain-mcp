import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { Project } from '@/types/project.types';

export const projectService = {
    /**
     * Get all projects
     */
    async getAll(): Promise<Project[]> {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PROJECTS);
            // Handle API response structure: { success: true, data: { projects: [], total: 0 } }
            const projects = response.data?.data?.projects || response.data?.projects || response.data || [];
            return Array.isArray(projects) ? projects : [];
        } catch (error) {
            console.error('Error fetching projects:', error);
            // Return empty array on error to prevent UI crashes
            return [];
        }
    },

    /**
     * Get a single project by ID
     */
    async getById(id: string): Promise<Project> {
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS}/${id}`);
        return response.data;
    },

    /**
     * Create a new project
     */
    async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        const response = await apiClient.post(API_ENDPOINTS.PROJECTS, data);
        return response.data;
    },

    /**
     * Update a project
     */
    async update(id: string, data: Partial<Project>): Promise<Project> {
        const response = await apiClient.put(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
        return response.data;
    },
};
