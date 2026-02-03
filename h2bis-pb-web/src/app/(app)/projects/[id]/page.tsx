'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/project.types';
import { Loader2, ArrowLeft, Edit, Save, X, Calendar, Code, Folder, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const projectId = params?.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editedProject, setEditedProject] = useState<Partial<Project>>({});

    useEffect(() => {
        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    const loadProject = async () => {
        try {
            setIsLoading(true);
            const data = await projectService.getById(projectId);
            setProject(data);
            setEditedProject(data);
        } catch (error) {
            console.error('Error loading project:', error);
            toast({
                title: 'Error',
                description: 'Failed to load project details',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await projectService.update(projectId, editedProject);
            setProject({ ...project, ...editedProject } as Project);
            setIsEditing(false);
            toast({
                title: 'Success',
                description: 'Project updated successfully',
            });
        } catch (error) {
            console.error('Error updating project:', error);
            toast({
                title: 'Error',
                description: 'Failed to update project',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProject(project || {});
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <p className="text-muted-foreground">Project not found</p>
                <Button onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{project.name}</h1>
                        <p className="text-muted-foreground">Project Details</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Overview Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Basic project information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Project Name</Label>
                                        <Input
                                            id="name"
                                            value={editedProject.name || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            rows={4}
                                            value={editedProject.description || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                                        <p className="mt-1">{project.description || 'No description provided'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Created {new Date(project.createdAt || '').toLocaleDateString()}
                                        </span>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Metadata Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Details</CardTitle>
                            <CardDescription>Technology stack and configuration</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Primary Language</Label>
                                        <Input
                                            id="language"
                                            value={editedProject.metadata?.language || ''}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                metadata: { ...editedProject.metadata, language: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="framework">Framework</Label>
                                        <Input
                                            id="framework"
                                            value={editedProject.metadata?.framework || ''}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                metadata: { ...editedProject.metadata, framework: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="repository">Repository URL</Label>
                                        <Input
                                            id="repository"
                                            type="url"
                                            value={editedProject.metadata?.repository || ''}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                metadata: { ...editedProject.metadata, repository: e.target.value }
                                            })}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Language</h4>
                                        <p className="mt-1">{project.metadata?.language || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Framework</h4>
                                        <p className="mt-1">{project.metadata?.framework || 'Not specified'}</p>
                                    </div>
                                    {project.metadata?.repository && (
                                        <div className="col-span-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Repository</h4>
                                            <a
                                                href={project.metadata.repository}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 text-primary hover:underline flex items-center gap-1"
                                            >
                                                {project.metadata.repository}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.metadata?.techStack && project.metadata.techStack.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {project.metadata.techStack.map((tech) => (
                                                <Badge key={tech} variant="secondary">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Placeholder: Code Structure */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Folder className="h-5 w-5" />
                                Code Structure
                            </CardTitle>
                            <CardDescription>Project folder structure and files</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Code className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">Code structure viewer coming soon</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    This will display your project's folder structure and files
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Placeholder: Generated APIs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Network className="h-5 w-5" />
                                Generated APIs
                            </CardTitle>
                            <CardDescription>API endpoints generated from use cases</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <Network className="h-12 w-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">API list coming soon</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    This will show all API endpoints created from your use cases
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Status Badge */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge
                                variant={project.status === 'active' ? 'default' : 'secondary'}
                                className="text-lg py-2 px-4"
                            >
                                {project.status || 'Active'}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                            <CardDescription>Project metrics and progress</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Use Cases</span>
                                <span className="font-bold text-2xl">{project.stats?.useCaseCount || 0}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Capabilities</span>
                                <span className="font-bold text-2xl">{project.stats?.capabilityCount || 0}</span>
                            </div>
                            <Separator />
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Completion</span>
                                    <span className="font-bold">{project.stats?.completionPercentage || 0}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${project.stats?.completionPercentage || 0}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">ID</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{project.id}</code>
                            </div>
                            {project.owner && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Owner</span>
                                    <span>{project.owner}</span>
                                </div>
                            )}
                            {project.updatedAt && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
