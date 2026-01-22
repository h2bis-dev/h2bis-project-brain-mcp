import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCaseService, type CreateUseCaseRequest, type CreateUseCaseResponse } from '@/services/use-case.service';
import type { UseCase } from '@/types/use-case.types';

/**
 * Hook to fetch all use cases
 * Automatically handles loading, error states, and caching
 */
export function useUseCases() {
    return useQuery<UseCase[], Error>({
        queryKey: ['use-cases'],
        queryFn: () => useCaseService.getAll(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });
}

/**
 * Hook to fetch a single use case by ID or key
 */
export function useUseCase(id: string) {
    return useQuery<UseCase, Error>({
        queryKey: ['use-case', id],
        queryFn: () => useCaseService.getById(id),
        enabled: !!id, // Only run query if id is provided
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

    return useMutation<CreateUseCaseResponse, Error, CreateUseCaseRequest>({
        mutationFn: (data) => useCaseService.create(data),
        onSuccess: () => {
            // Invalidate use cases list to refetch
            queryClient.invalidateQueries({ queryKey: ['use-cases'] });
            // Navigate back to use cases list
            router.push('/use-cases');
        },
    });
}
