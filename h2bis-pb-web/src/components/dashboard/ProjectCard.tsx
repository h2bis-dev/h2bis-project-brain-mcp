'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useSwitchProject } from "@/hooks/useProject";
import type { Project } from "@/types/project.types";

const getLifecycleBadgeColor = (lifecycle: string) => {
    const colors: Record<string, string> = {
        planning: 'bg-gray-100 text-gray-700 border-gray-300',
        in_development: 'bg-blue-100 text-blue-700 border-blue-300',
        in_review: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        in_testing: 'bg-purple-100 text-purple-700 border-purple-300',
        staging: 'bg-orange-100 text-orange-700 border-orange-300',
        production: 'bg-green-100 text-green-700 border-green-300',
        maintenance: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        archived: 'bg-slate-100 text-slate-700 border-slate-300',
    };
    return colors[lifecycle] || colors.planning;
};

const formatLifecycle = (lifecycle: string) => {
    return lifecycle.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    useCaseCount: number;
    lifecycle?: string;
}

export function ProjectCard({ id, name, description, useCaseCount, lifecycle = 'planning' }: ProjectCardProps) {
    const router = useRouter();
    const { switchProject } = useSwitchProject();

    const handleClick = () => {
        // Create a project object to pass to switchProject
        const project: Project = {
            id,
            name,
            description,
            stats: {
                useCaseCount,
            },
        };

        // Update the selected project in context (this will update the navbar dropdown)
        switchProject(project);

        // Navigate to the projects page
        router.push(ROUTES.PROJECTS);
    };

    return (
        <Card
            className="hover:shadow-lg transition-shadow cursor-pointer h-full"
            onClick={handleClick}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Folder className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{name}</CardTitle>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                        {lifecycle && (
                            <Badge
                                variant="outline"
                                className={`${getLifecycleBadgeColor(lifecycle)}`}
                            >
                                {formatLifecycle(lifecycle)}
                            </Badge>
                        )}
                        <Badge variant="secondary">
                            {useCaseCount} {useCaseCount === 1 ? 'use case' : 'use cases'}
                        </Badge>
                    </div>
                </div>
                {description && (
                    <CardDescription className="mt-2 line-clamp-2">
                        {description}
                    </CardDescription>
                )}
            </CardHeader>
        </Card>
    );
}
