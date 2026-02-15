import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
    useCaseService,
    type CreateUseCaseRequest,
    type CreateUseCaseResponse,
    type UpdateUseCaseRequest,
    type UpdateUseCaseResponse,
    type EnhanceUseCaseRequest,
    type EnhanceUseCaseResponse,
    type UpdateWithAIRequest,
    type UpdateWithAIResponse,
} from '@/services/use-case.service';
import { useSelectedProject } from '@/hooks/useProject';
import type { UseCase } from '@/types/use-case.types';

/**
 * Hook to fetch all use cases for the selected project
 * Automatically handles loading, error states, and caching
 */
export function useUseCases() {
    const selectedProject = useSelectedProject();

    return useQuery<UseCase[], Error>({
        queryKey: ['use-cases', selectedProject?.id],
        queryFn: () => {
            if (!selectedProject) return [];
            return useCaseService.getAll(selectedProject.id);
        },
        enabled: !!selectedProject,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
}

/**
 * Hook to fetch a single use case by ID or key
 */
export function useUseCase(id: string) {
    const selectedProject = useSelectedProject();

    return useQuery<UseCase, Error>({
        queryKey: ['use-case', id, selectedProject?.id],
        queryFn: () => useCaseService.getById(id),
        enabled: !!id && !!selectedProject,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
}

/**
 * Hook to create a new use case
 * Automatically invalidates cache and navigates on success
 */
export function useCreateUseCase() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const selectedProject = useSelectedProject();

    return useMutation<CreateUseCaseResponse, Error, CreateUseCaseRequest>({
        mutationFn: (data) => useCaseService.create(data, selectedProject?.id),
        onSuccess: () => {
            // Invalidate use cases list to refetch
            queryClient.invalidateQueries({ queryKey: ['use-cases', selectedProject?.id] });
            // Navigate back to use cases list
            router.push('/use-cases');
        },
    });
}

/**
 * Hook to update an existing use case
 * Invalidates both the list and detail caches, navigates on success
 */
export function useUpdateUseCase() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const selectedProject = useSelectedProject();

    return useMutation<UpdateUseCaseResponse, Error, { id: string; data: UpdateUseCaseRequest }>({
        mutationFn: ({ id, data }) => useCaseService.update(id, data),
        onSuccess: (_, { id }) => {
            // Invalidate both list and detail caches
            queryClient.invalidateQueries({ queryKey: ['use-cases', selectedProject?.id] });
            queryClient.invalidateQueries({ queryKey: ['use-case', id, selectedProject?.id] });
            // Navigate back to use cases list
            router.push('/use-cases');
        },
    });
}

/**
 * Hook to enhance an existing use case with AI
 * Returns enhanced data without navigating (user reviews in form first)
 */
export function useEnhanceUseCase() {
    return useMutation<EnhanceUseCaseResponse, Error, EnhanceUseCaseRequest>({
        mutationFn: (data) => useCaseService.enhance(data),
    });
}

/**
 * Hook to save use case changes without navigation
 * Used by the detail view after AI-generated updates are confirmed by user
 */
export function useSaveUseCase() {
    const queryClient = useQueryClient();
    const selectedProject = useSelectedProject();

    return useMutation<UpdateUseCaseResponse, Error, { id: string; data: UpdateUseCaseRequest }>({
        mutationFn: ({ id, data }) => useCaseService.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['use-cases', selectedProject?.id] });
            queryClient.invalidateQueries({ queryKey: ['use-case', id, selectedProject?.id] });
        },
    });
}

/**
 * Hook to generate AI-updated use case data using project context
 * Automatically saves the changes and invalidates cache to refresh the UI
 */
export function useUpdateUseCaseWithAI() {
    const queryClient = useQueryClient();
    const selectedProject = useSelectedProject();

    return useMutation<UpdateWithAIResponse, Error, UpdateWithAIRequest>({
        mutationFn: (data) => useCaseService.updateWithAI(data),
        onSuccess: (_, variables) => {
            // Invalidate both list and detail caches to reflect the AI updates
            queryClient.invalidateQueries({ queryKey: ['use-cases', selectedProject?.id] });
            queryClient.invalidateQueries({ queryKey: ['use-case', variables.useCaseId, selectedProject?.id] });
        },
    });
}

/**
 * Hook to delete a use case (admin/moderator only)
 * Automatically invalidates cache on success
 */
export function useDeleteUseCase() {
    const queryClient = useQueryClient();

    return useMutation<{ success: boolean; message: string }, Error, string>({
        mutationFn: (id) => useCaseService.delete(id),
        onSuccess: () => {
            // Invalidate use cases list to refetch
            queryClient.invalidateQueries({ queryKey: ['use-cases'] });
        },
    });
}
