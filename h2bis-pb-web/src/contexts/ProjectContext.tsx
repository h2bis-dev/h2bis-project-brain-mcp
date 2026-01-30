'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { projectService } from '@/services/project.service';
import type { Project, ProjectContextType } from '@/types/project.types';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load projects when session is available
    useEffect(() => {
        if (!session?.user?.id) {
            setIsLoading(false);
            return;
        }

        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const projectsList = await projectService.getAll();
                setProjects(projectsList);

                // Set default project (first one or from localStorage)
                const savedProjectId = localStorage.getItem('selectedProjectId');
                let defaultProject = projectsList[0];

                if (savedProjectId && projectsList.length > 0) {
                    const savedProject = projectsList.find(p => p.id === savedProjectId);
                    if (savedProject) {
                        defaultProject = savedProject;
                    }
                }

                if (defaultProject) {
                    setSelectedProject(defaultProject);
                    localStorage.setItem('selectedProjectId', defaultProject.id);
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();
    }, [session?.user?.id]);

    const selectProject = (project: Project) => {
        setSelectedProject(project);
        localStorage.setItem('selectedProjectId', project.id);
        // Invalidate use cases cache when project changes
        if (typeof window !== 'undefined') {
            window.dispatchEvent(
                new CustomEvent('projectChanged', { detail: project })
            );
        }
    };

    const setDefaultProject = (project: Project) => {
        selectProject(project);
    };

    const value: ProjectContextType = {
        selectedProject,
        projects,
        isLoading,
        selectProject,
        setDefaultProject,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProject() {
    const context = useContext(ProjectContext);
    if (context === undefined) {
        throw new Error('useProject must be used within a ProjectProvider');
    }
    return context;
}
