export interface Project {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectContextType {
    selectedProject: Project | null;
    projects: Project[];
    isLoading: boolean;
    selectProject: (project: Project) => void;
    setDefaultProject: (project: Project) => void;
}
