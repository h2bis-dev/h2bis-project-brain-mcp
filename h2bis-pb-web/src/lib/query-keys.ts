/**
 * Query key factory for React Query
 * Provides hierarchical query keys for cache management
 */

export const queryKeys = {
    useCases: {
        all: ["use-cases"] as const,
        lists: () => [...queryKeys.useCases.all, "list"] as const,
        list: (filters?: Record<string, any>) =>
            [...queryKeys.useCases.lists(), filters] as const,
        details: () => [...queryKeys.useCases.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.useCases.details(), id] as const,
    },
    capabilities: {
        all: ["capabilities"] as const,
        lists: () => [...queryKeys.capabilities.all, "list"] as const,
        list: (filters?: Record<string, any>) =>
            [...queryKeys.capabilities.lists(), filters] as const,
        details: () => [...queryKeys.capabilities.all, "detail"] as const,
        detail: (id: string) => [...queryKeys.capabilities.details(), id] as const,
        dependencies: (id: string, depth: number) =>
            [...queryKeys.capabilities.all, id, "dependencies", depth] as const,
        dependents: (id: string, depth: number) =>
            [...queryKeys.capabilities.all, id, "dependents", depth] as const,
        impact: (id: string) =>
            [...queryKeys.capabilities.all, id, "impact"] as const,
        fullContext: (id: string) =>
            [...queryKeys.capabilities.all, id, "full-context"] as const,
    },
    features: {
        all: ["features"] as const,
        lists: () => [...queryKeys.features.all, "list"] as const,
        list: (filters?: Record<string, any>) =>
            [...queryKeys.features.lists(), filters] as const,
        detail: (id: string) => [...queryKeys.features.all, id] as const,
    },
    analytics: {
        all: ["analytics"] as const,
        summaries: () => [...queryKeys.analytics.all, "summaries"] as const,
    },
};
