'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { useProject } from '@/contexts/ProjectContext';
import type { Project } from '@/types/project.types';

/**
 * Hook to fetch all projects
 */
export function useProjects() {
    return useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: () => projectService.getAll(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    });
}

/**
 * Hook to get the currently selected project
 */
export function useSelectedProject() {
    const { selectedProject } = useProject();
    return selectedProject;
}

/**
 * Hook to switch projects
 */
export function useSwitchProject() {
    const { selectProject } = useProject();
    const queryClient = useQueryClient();

    return {
        switchProject: (project: Project) => {
            selectProject(project);
            // Invalidate use cases and related data
            queryClient.invalidateQueries({ queryKey: ['use-cases'] });
            queryClient.invalidateQueries({ queryKey: ['capabilities'] });
        },
    };
}

/**
 * Hook to fetch use cases for the selected project
 */
export function useProjectUseCases() {
    const selectedProject = useSelectedProject();

    return useQuery<any[], Error>({
        queryKey: ['use-cases', selectedProject?.id],
        queryFn: async () => {
            if (!selectedProject) return [];
            // This will be called with projectId as a query parameter
            const response = await fetch(
                `/api/use-cases?projectId=${selectedProject.id}`
            );
            if (!response.ok) throw new Error('Failed to fetch use cases');
            return response.json();
        },
        enabled: !!selectedProject,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
}
