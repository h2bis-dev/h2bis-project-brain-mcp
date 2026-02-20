'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { getDashboardStats, type DashboardProject } from '@/services/dashboard.service';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Loader2, AlertCircle } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

export default function DashboardPage() {
    const { data: session } = useSession();
    const { deleteProject } = useProject();
    const [projects, setProjects] = useState<DashboardProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const canDeleteProject = session?.user?.permissions?.includes('delete:project') ?? false;

    const fetchDashboardData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getDashboardStats();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleDeleteProject = async (id: string) => {
        await deleteProject(id);
        await fetchDashboardData();
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                </div>
                <p className="text-muted-foreground mt-2">
                    Overview of all your projects and their use cases
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Loading dashboard...</p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <Card className="border-destructive">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <CardTitle className="text-destructive">Error</CardTitle>
                        </div>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {/* Projects Grid */}
            {!loading && !error && (
                <>
                    {projects.length === 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>No Projects Yet</CardTitle>
                                <CardDescription>
                                    Get started by creating your first project
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    id={project._id}
                                    name={project.name}
                                    description={project.description}
                                    useCaseCount={project.useCaseCount}
                                    lifecycle={project.lifecycle}
                                    canDelete={canDeleteProject}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

