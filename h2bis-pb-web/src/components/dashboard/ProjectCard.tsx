'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useSwitchProject } from "@/hooks/useProject";
import type { Project } from "@/types/project.types";

export interface ProjectCardProps {
    id: string;
    name: string;
    description: string;
    useCaseCount: number;
}

export function ProjectCard({ id, name, description, useCaseCount }: ProjectCardProps) {
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
                    <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {useCaseCount} {useCaseCount === 1 ? 'use case' : 'use cases'}
                    </Badge>
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
