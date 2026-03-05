export interface ProjectMember {
    userId: string;
    role: string;
    email?: string;
    name?: string;
}

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

export type DomainModelLayer = 'data' | 'dto' | 'domain' | 'response' | 'request' | 'event' | 'other';

export interface DomainField {
    name: string;
    type: string;
    required: boolean;
    description?: string;
    defaultValue?: string;
    constraints: string[];
}

export interface DomainEntity {
    name: string;
    description?: string;
    layer?: DomainModelLayer;
    fields: DomainField[];
    usedByUseCases: string[];
    addedBy?: string;
    addedAt?: string;
    updatedAt?: string;
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
    domainCatalog?: DomainEntity[];
    members?: ProjectMember[];
    metadata?: {
        repository?: string;
        techStack?: string[];
        language?: string;
        framework?: string;
        architecture?: {
            overview?: string;  // String, not array - matches API
            style?: string;     // String, not array - matches API
            directoryStructure?: string;
            stateManagement?: string[];
        };
        authStrategy?: {
            approach?: string;         // String, not array - matches API
            implementation?: string[]; // Array, not string - matches API
        };
        deployment?: {
            environment?: string;  // String, not array - matches API
            cicd?: string[];
        };
        externalServices?: Array<{
            name: string;
            purpose?: string;
            apiDocs?: string;
        }>;
        standards?: {
            namingConventions?: string[];
            errorHandling?: string[];
            loggingConvention?: string[];
        };
        qualityGates?: {
            definitionOfDone?: string[];
            codeReviewChecklist?: string[];
            testingRequirements?: {
                coverage?: number;
                testTypes?: string[];
                requiresE2ETests?: boolean;
            };
            documentationStandards?: string[];
        };
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
    deleteProject: (id: string) => Promise<void>;
}
