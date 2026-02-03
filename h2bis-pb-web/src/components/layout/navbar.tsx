"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Bell, Settings, User, Plus } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useSwitchProject } from "@/hooks/useProject";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import type { Project } from "@/types/project.types";

export function Navbar() {
    const router = useRouter();
    const { selectedProject, projects, isLoading, refreshProjects } = useProject();
    const { switchProject } = useSwitchProject();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleProjectChange = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            switchProject(project);
        }
    };

    const handleProjectCreated = async (newProject: Project) => {
        // Refresh projects list to include the new project
        await refreshProjects();

        // Switch to the new project
        switchProject(newProject);

        // Navigate to project details
        router.push(`/projects/${newProject.id}`);
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-8">
                    {/* Left side - branding and project selector */}
                    <div className="flex items-center gap-6">
                        <div className="text-sm font-semibold text-foreground">
                            H2BIS ProjectBrain
                        </div>

                        {/* Project Selector */}
                        <div className="flex items-center gap-2">
                            <Select
                                value={selectedProject?.id}
                                onValueChange={handleProjectChange}
                                disabled={isLoading || projects.length === 0}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder={isLoading ? "Loading projects..." : "Select a project"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Create Project Button - Admin Only */}
                            <PermissionGuard permission="create:project">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create Project
                                </Button>
                            </PermissionGuard>
                        </div>
                    </div>

                    {/* Right side - actions */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Create Project Modal */}
            <CreateProjectModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleProjectCreated}
            />
        </>
    );
}
