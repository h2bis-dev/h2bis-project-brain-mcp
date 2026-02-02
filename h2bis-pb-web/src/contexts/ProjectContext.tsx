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
            setProjects([]);
            setSelectedProject(null);
            return;
        }

        const loadProjects = async () => {
            try {
                setIsLoading(true);
                const projectsList = await projectService.getAll();

                // Handle null or undefined response
                const safeProjectsList = Array.isArray(projectsList) ? projectsList : [];
                setProjects(safeProjectsList);

                // DO NOT auto-select - user must explicitly choose a project
                setSelectedProject(null);
                localStorage.removeItem('selectedProjectId');

                if (safeProjectsList.length > 0) {
                    console.info(`${safeProjectsList.length} project(s) loaded. Please select a project to continue.`);
                } else {
                    console.info('No projects available. Please create a project to get started.');
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
                // Set empty state on error
                setProjects([]);
                setSelectedProject(null);
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
