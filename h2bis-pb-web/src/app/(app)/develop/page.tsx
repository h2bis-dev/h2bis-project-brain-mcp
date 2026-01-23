'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Database, Settings, Users } from 'lucide-react';

export default function DevelopPage() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Developer Tools</h1>
                <p className="text-muted-foreground mt-2">
                    Admin-only developer and system management tools
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            API Management
                        </CardTitle>
                        <CardDescription>
                            Manage API endpoints and configurations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            View and manage API endpoints, test API calls, and configure API settings.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Database Tools
                        </CardTitle>
                        <CardDescription>
                            Database management and monitoring
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            View database statistics, manage collections, and perform database operations.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Management
                        </CardTitle>
                        <CardDescription>
                            Manage users and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            View all users, manage roles and permissions, and monitor user activity.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            System Settings
                        </CardTitle>
                        <CardDescription>
                            System configuration and settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Configure system settings, manage environment variables, and system logs.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <CardHeader>
                    <CardTitle className="text-amber-700 dark:text-amber-500">
                        ⚠️ Admin Access Only
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        This page is only accessible to users with admin permissions.
                        All actions performed here are logged and monitored.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
