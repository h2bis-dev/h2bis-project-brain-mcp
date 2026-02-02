'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, Network, Activity, AlertCircle } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

export default function DashboardPage() {
    const { selectedProject } = useProject();

    // Show notice if no project is selected
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome to H2BIS ProjectBrain - Manage your project knowledge
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Use Cases
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedProject.stats?.useCaseCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total use cases in project
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Capabilities
                        </CardTitle>
                        <Network className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedProject.stats?.capabilityCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Generated capabilities
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Completion
                        </CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{selectedProject.stats?.completionPercentage || 0}%</div>
                        <p className="text-xs text-muted-foreground">
                            Project progress
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            System Status
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Active</div>
                        <p className="text-xs text-muted-foreground">
                            API connected
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and operations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                            • Create new use case
                        </div>
                        <div className="text-sm text-muted-foreground">
                            • View capability graph
                        </div>
                        <div className="text-sm text-muted-foreground">
                            • Analyze with AI
                        </div>
                        <div className="text-sm text-muted-foreground">
                            • Browse summaries
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest changes and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            No recent activity
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
