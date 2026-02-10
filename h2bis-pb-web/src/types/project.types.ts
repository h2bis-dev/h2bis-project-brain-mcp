export interface DevelopedEndpoint {
    useCaseId: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    service: string;
    description: string;
    requestSchema: any;
    responseSchema: any;
    addedAt: string;
    lastScanned?: string;
}

export interface Project {
    _id?: string;
    id: string;
    name: string;
    description?: string;
    status?: 'active' | 'archived' | 'deleted';
    lifecycle?: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    owner?: string;
    type?: 'software_development';
    developedEndpoints?: DevelopedEndpoint[];
    members?: any[];
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
