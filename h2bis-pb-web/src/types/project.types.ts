export interface Project {
    id: string;
    name: string;
    description?: string;
    status?: 'active' | 'archived' | 'deleted';
    owner?: string;
    type?: 'software_development';
    metadata?: {
        repository?: string;
        techStack?: string[];
        language?: string;
        framework?: string;
    };
    stats?: {
        useCaseCount?: number;
        capabilityCount?: number;
        completionPercentage?: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectContextType {
    selectedProject: Project | null;
    projects: Project[];
    isLoading: boolean;
    selectProject: (project: Project) => void;
    setDefaultProject: (project: Project) => void;
    refreshProjects: () => Promise<void>;
}
