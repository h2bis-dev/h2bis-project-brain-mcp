'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Folder, Trash2 } from "lucide-react";
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
    /** When true, a delete button is shown (admin only, planning lifecycle only) */
    canDelete?: boolean;
    /** Called after the user confirms deletion */
    onDelete?: (id: string) => Promise<void>;
}

export function ProjectCard({
    id,
    name,
    description,
    useCaseCount,
    lifecycle = 'planning',
    canDelete = false,
    onDelete,
}: ProjectCardProps) {
    const router = useRouter();
    const { switchProject } = useSwitchProject();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const showDeleteButton = canDelete && lifecycle === 'planning';

    const handleClick = () => {
        const project: Project = {
            id,
            name,
            description,
            stats: { useCaseCount },
        };
        switchProject(project);
        router.push(ROUTES.PROJECTS);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!onDelete) return;
        try {
            setDeleting(true);
            await onDelete(id);
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <>
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
                        <div className="flex gap-2 flex-shrink-0 ml-2 items-center">
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
                            {showDeleteButton && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={handleDeleteClick}
                                    title="Delete project"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    {description && (
                        <CardDescription className="mt-2 line-clamp-2">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>
            </Card>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{name}</strong>? This action
                            cannot be undone. All associated data will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? 'Deleting...' : 'Delete Project'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

