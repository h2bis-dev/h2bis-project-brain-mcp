import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCaseService, type CreateUseCaseRequest, type CreateUseCaseResponse } from '@/services/use-case.service';
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
