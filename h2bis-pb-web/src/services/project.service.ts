import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/lib/config';
import type { Project, ProjectService } from '@/types/project.types';

export const projectService = {
    /**
     * Get all projects
     */
    async getAll(): Promise<Project[]> {
        try {
            const response = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
            // Handle API response structure: { success: true, data: { projects: [], total: 0 } }
            const projects = response.data?.data?.projects || response.data?.projects || response.data || [];

            // Map _id to id for consistency with web layer
            const mappedProjects = Array.isArray(projects)
                ? projects.map((p: any) => ({
                    ...p,
                    id: p._id || p.id,
                }))
                : [];

            return mappedProjects;
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
        const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.LIST}/${id}`);
        const project = response.data?.data || response.data;

        // Map _id to id for consistency
        return {
            ...project,
            id: project._id || project.id,
        };
    },

    /**
     * Get the list of services/applications for a project
     */
    async getServices(id: string): Promise<ProjectService[]> {
        const response = await apiClient.get(API_ENDPOINTS.PROJECTS.SERVICES(id));
        return response.data?.data?.services ?? [];
    },

    /**
     * Create a new project
     */
    async create(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        // Transform data to match API expectations - only send non-empty values
        const transformedData: any = {
            _id: data._id,
            name: data.name,
        };

        // Only add fields if they have values
        if (data.description) {
            transformedData.description = data.description;
        }

        if (data.lifecycle) {
            transformedData.lifecycle = data.lifecycle;
        }

        // Build metadata only if fields are provided
        if (data.metadata) {
            const metadata: any = {};

            if (data.metadata.repository) metadata.repository = data.metadata.repository;

            // Add nested metadata only if provided
            if (data.metadata.architecture) {
                metadata.architecture = {
                    overview: data.metadata.architecture.overview || '',
                    style: data.metadata.architecture.style || '',
                    directoryStructure: data.metadata.architecture.directoryStructure || '',
                    stateManagement: data.metadata.architecture.stateManagement || [],
                };
            }

            if (data.metadata.authStrategy) {
                metadata.authStrategy = {
                    approach: data.metadata.authStrategy.approach || '',
                    implementation: data.metadata.authStrategy.implementation || [],
                };
            }

            if (data.metadata.deployment) {
                metadata.deployment = {
                    environment: data.metadata.deployment.environment || '',
                    cicd: data.metadata.deployment.cicd || [],
                };
            }

            if (data.metadata.externalServices?.length) {
                metadata.externalServices = data.metadata.externalServices;
            }

            if (data.metadata.services) {
                metadata.services = data.metadata.services.map(service => ({
                    id:          service.id          || '',
                    name:        service.name        || '',
                    type:        service.type        || 'other',
                    language:    service.language    || '',
                    framework:   service.framework   || '',
                    techStack:   service.techStack   || [],
                    description: service.description || '',
                    goals:       service.goals       || '',
                    repository:  service.repository  || '',
                }));
            }

            if (data.metadata.standards) {
                metadata.standards = {
                    namingConventions: data.metadata.standards.namingConventions || [],
                    errorHandling: data.metadata.standards.errorHandling || [],
                    loggingConvention: data.metadata.standards.loggingConvention || [],
                };
            }

            if (data.metadata.qualityGates) {
                metadata.qualityGates = data.metadata.qualityGates;
            }

            // Only include metadata if there are fields
            if (Object.keys(metadata).length > 0) {
                transformedData.metadata = metadata;
            }
        }

        console.log('Creating project with data:', JSON.stringify(transformedData, null, 2));

        try {
            const response = await apiClient.post(API_ENDPOINTS.PROJECTS.LIST, transformedData);
            const project = response.data?.data || response.data;

            // Map _id to id for consistency with web layer
            return {
                ...project,
                id: project._id || project.id,
            };
        } catch (error: any) {
            console.error('Project creation failed:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                validationErrors: error.response?.data?.details || error.response?.data?.error,
            });
            throw error;
        }
    },

    /**
     * Update a project
     */
    async update(id: string, data: Partial<Project>): Promise<Project> {
        // Build a clean update payload — only send fields the API accepts
        const payload: any = {};

        if (data.name)        payload.name        = data.name;
        if (data.description !== undefined) payload.description = data.description;
        if (data.lifecycle)   payload.lifecycle   = data.lifecycle;

        if (data.metadata) {
            const metadata: any = {};

            if (data.metadata.repository !== undefined) metadata.repository = data.metadata.repository;

            if (data.metadata.services !== undefined) {
                metadata.services = data.metadata.services.map((service: any) => ({
                    id:          service.id          || '',
                    name:        service.name        || '',
                    type:        service.type        || 'other',
                    language:    service.language    || '',
                    framework:   service.framework   || '',
                    techStack:   service.techStack   || [],
                    description: service.description || '',
                    goals:       service.goals       || '',
                    repository:  service.repository  || '',
                }));
            }

            if (data.metadata.architecture) {
                metadata.architecture = {
                    overview:           data.metadata.architecture.overview           ?? '',
                    style:              data.metadata.architecture.style              ?? '',
                    directoryStructure: data.metadata.architecture.directoryStructure ?? '',
                    stateManagement:    data.metadata.architecture.stateManagement    ?? [],
                };
            }

            if (data.metadata.authStrategy) {
                metadata.authStrategy = {
                    approach:       data.metadata.authStrategy.approach       ?? '',
                    implementation: data.metadata.authStrategy.implementation ?? [],
                };
            }

            if (data.metadata.deployment) {
                metadata.deployment = {
                    environment: data.metadata.deployment.environment ?? '',
                    cicd:        data.metadata.deployment.cicd        ?? [],
                };
            }

            if (data.metadata.externalServices !== undefined) {
                metadata.externalServices = data.metadata.externalServices;
            }

            if (data.metadata.standards) {
                metadata.standards = {
                    namingConventions: data.metadata.standards.namingConventions ?? [],
                    errorHandling:     data.metadata.standards.errorHandling     ?? [],
                    loggingConvention: data.metadata.standards.loggingConvention ?? [],
                };
            }

            if (data.metadata.qualityGates) {
                metadata.qualityGates = data.metadata.qualityGates;
            }

            payload.metadata = metadata;
        }

        const response = await apiClient.put(`${API_ENDPOINTS.PROJECTS.LIST}/${id}`, payload);
        const project = response.data?.data || response.data;

        // Map _id to id for consistency
        return {
            ...project,
            id: project._id || project.id,
        };
    },

    /**
     * Delete a project (admin only, planning lifecycle only)
     * Performs a soft-delete on the backend.
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`${API_ENDPOINTS.PROJECTS.LIST}/${id}`);
    },
};
