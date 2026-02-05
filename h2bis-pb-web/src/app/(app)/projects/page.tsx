"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/contexts/ProjectContext";
import { ROUTES } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function ProjectsPage() {
    const router = useRouter();
    const { selectedProject, isLoading } = useProject();

    // Redirect to project details if a project is selected
    useEffect(() => {
        if (!isLoading && selectedProject) {
            router.push(ROUTES.PROJECT(selectedProject.id));
        }
    }, [selectedProject, isLoading, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">Loading projects...</p>
            </div>
        );
    }

    // Show "Select a Project" message when no project is selected
    if (!selectedProject) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Card className="max-w-md">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                            <CardTitle>Select a Project</CardTitle>
                        </div>
                        <CardDescription>
                            Please select a project from the dropdown menu above to access the dashboard and other features.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Once you select a project, you'll be able to:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                            <li>View project statistics</li>
                            <li>Manage use cases and capabilities</li>
                            <li>Access analytics and summaries</li>
                            <li>Track development progress</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // This should not be reached due to the useEffect redirect, but just in case
    return null;
}
