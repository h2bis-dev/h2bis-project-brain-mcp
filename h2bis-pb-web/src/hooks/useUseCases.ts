import { useQuery } from '@tanstack/react-query';
import { useCaseService } from '@/services/use-case.service';
import type { UseCase } from '@/types/use-case.types';

/**
 * Hook to fetch all use cases
 * Automatically handles loading, error states, and caching
 */
export function useUseCases() {
    return useQuery<UseCase[], Error>({
        queryKey: ['use-cases'],
        queryFn: () => useCaseService.getAll(),
        staleTime: 2 * 60 * 1000, // 2 minutes
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
