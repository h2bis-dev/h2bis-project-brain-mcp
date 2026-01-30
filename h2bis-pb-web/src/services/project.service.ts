import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { Project } from '@/types/project.types';

export const projectService = {
    /**
     * Get all projects
     */
    async getAll(): Promise<Project[]> {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS);
        return response.data;
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
