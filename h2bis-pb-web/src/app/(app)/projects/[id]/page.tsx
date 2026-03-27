"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, FolderOpen, Code2, Shield, Rocket, FileCheck, Link as LinkIcon, Users, Save, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { projectService } from "@/services/project.service";
import { TagInput } from "@/components/ui/tag-input";
import { PROJECT_METADATA_CONSTANTS } from "@/constants/project-metadata.constants";
import { ROUTES } from "@/lib/constants";
import { DomainModelTable } from "@/components/project/DomainModelTable";
import { ServicesPanel } from "@/components/project/ServicesPanel";
import type { Project, DomainEntity, ProjectService } from "@/types/project.types";

interface ExternalService {
    name: string;
    purpose: string;
    apiDocs?: string;
}

interface ProjectFormData {
    _id: string;
    name: string;
    description: string;
    lifecycle: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    metadata: {
        repository?: string;
        services?: ProjectService[];
        architecture?: {
            overview?: string;
            style?: string;
            directoryStructure?: string;
            stateManagement?: string[];
        };
        authStrategy?: {
            approach?: string;
            implementation?: string[];
        };
        deployment?: {
            environment?: string;
            cicd?: string[];
        };
        externalServices?: ExternalService[];
        standards?: {
            namingConventions?: string[];
            errorHandling?: string[];
            loggingConvention?: string[];
        };
        qualityGates?: {
            definitionOfDone?: string[];
            codeReviewChecklist?: string[];
            testingRequirements?: {
                coverage?: number;
                testTypes?: string[];
                requiresE2ETests?: boolean;
            };
            documentationStandards?: string[];
        };
        domainCatalog?: DomainEntity[];
    };
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const isNewProject = searchParams?.get('new') === 'true';
    const { toast } = useToast();

    const [formData, setFormData] = useState<ProjectFormData>({
        _id: '',
        name: '',
        description: '',
        lifecycle: 'planning',
        metadata: {
            architecture: {},
            authStrategy: {},
            deployment: {},
            standards: {},
            qualityGates: {},
            services: [],
        },
    });

    const [loading, setLoading] = useState(!isNewProject);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");
    const [developedEndpoints, setDevelopedEndpoints] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [scanningDomain, setScanningDomain] = useState(false);
    const [projectData, setProjectData] = useState<Project | null>(null);
    const [originalFormData, setOriginalFormData] = useState<ProjectFormData | null>(null);

    useEffect(() => {
        if (!isNewProject && projectId !== 'new') {
            loadProject();
        } else {
            setFormData(prev => ({ ...prev, _id: projectId === 'new' ? '' : projectId }));
        }
    }, [projectId, isNewProject]);

    const loadProject = async () => {
        try {
            setLoading(true);
            const data = await projectService.getById(projectId);
            const loadedFormData = {
                _id: data._id || data.id,
                name: data.name,
                description: data.description || '',
                lifecycle: data.lifecycle || 'planning',
                // Normalize metadata: the API returns optional fields (purpose?: string)
                // but the form type requires non-optional strings. Default them to ''.
                metadata: {
                    ...(data.metadata || {}),
                    externalServices: (data.metadata?.externalServices || []).map(
                        (svc: { name: string; purpose?: string; apiDocs?: string }) => ({
                            name: svc.name,
                            purpose: svc.purpose ?? '',
                            apiDocs: svc.apiDocs ?? '',
                        })
                    ),
                    services: (data.metadata?.services || []) as ProjectService[],
                    qualityGates: data.metadata?.qualityGates,
                },
            };
            setFormData(loadedFormData);
            setOriginalFormData(JSON.parse(JSON.stringify(loadedFormData))); // Deep clone
            setDevelopedEndpoints(data.developedEndpoints || []);
            setMembers(data.members || []);
        } catch (error) {
            console.error("Error loading project:", error);
            toast({
                title: "Error",
                description: "Failed to load project details",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateField = (path: string, value: any) => {
        setFormData(prev => {
            const keys = path.split('.');
            const updated = { ...prev };
            let current: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const generateProjectId = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50);
    };

    const handleNameChange = (name: string) => {
        updateField('name', name);
        if (isNewProject || !formData._id) {
            updateField('_id', generateProjectId(name));
        }
    };

    const isFormValid = () => {
        return formData._id.length >= 3 && formData.name.length >= 1;
    };

    // Check if form data has changed from original
    const hasChanges = () => {
        if (isNewProject) return true;
        if (!originalFormData) return false;
        return JSON.stringify(formData) !== JSON.stringify(originalFormData);
    };

    const handleSave = async () => {
        if (!isFormValid()) {
            toast({
                title: "Validation Error",
                description: "Project ID (min 3 chars) and Name are required",
                variant: "destructive",
            });
            setActiveTab("basic");
            return;
        }

        try {
            setSaving(true);

            if (isNewProject || projectId === 'new') {
                // ProjectFormData and Project types differ in optional fields;
                // cast to any so the service call compiles. The API is flexible.
                const newProject = await projectService.create(formData as any);
                toast({
                    title: "Success",
                    description: `Project "${formData.name}" created successfully`,
                });
                router.push(ROUTES.PROJECT(newProject._id || newProject.id));
            } else {
                await projectService.update(projectId, formData as any);
                toast({
                    title: "Success",
                    description: "Project updated successfully",
                });
                // Reload to get fresh data and reset change tracking
                await loadProject();
            }
        } catch (error: any) {
            console.error("Error saving project:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to save project",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

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

    // Placeholder handler for domain model scanning (backend not implemented yet)
    const handleScanDomainModels = async () => {
        setScanningDomain(true);
        toast({
            title: "Feature Coming Soon",
            description: "Domain model scanning will be available when the backend API is implemented.",
        });
        setTimeout(() => setScanningDomain(false), 1000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading project...</p>
                </div>
            </div>
        );
    }

    const lifecycleStatus = PROJECT_METADATA_CONSTANTS.lifecycleStatuses.find(
        (s) => s.value === formData.lifecycle
    );

    return (
        <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(ROUTES.DASHBOARD)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                {isNewProject || !formData.name ? "New Project" : formData.name}
                            </h1>
                            <p className="text-muted-foreground">
                                {isNewProject ? "Fill in the project details below" : formData._id}
                            </p>
                        </div>
                    </div>
                </div>
                {lifecycleStatus && !isNewProject && (
                    <Badge variant="outline" className={getLifecycleBadgeColor(formData.lifecycle)}>
                        {lifecycleStatus.label}
                    </Badge>
                )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                    <TabsTrigger value="architecture">Architecture</TabsTrigger>
                    <TabsTrigger value="auth-deploy">Auth & Deploy</TabsTrigger>
                    <TabsTrigger value="standards">Standards</TabsTrigger>
                    <TabsTrigger value="endpoints">API Registry</TabsTrigger>
                    <TabsTrigger value="domain">Domain Models</TabsTrigger>
                    <TabsTrigger value="services">External Services</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Essential project details (required)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Project Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="My Awesome Project"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="_id">
                                    Project ID <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="_id"
                                    placeholder="my-awesome-project"
                                    value={formData._id}
                                    onChange={(e) => updateField('_id', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lowercase, numbers, and hyphens only. Min 3 characters.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of your project..."
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lifecycle">Lifecycle Status</Label>
                                <Select
                                    value={formData.lifecycle}
                                    onValueChange={(value) => updateField('lifecycle', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_METADATA_CONSTANTS.lifecycleStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Current development stage
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tech Stack Tab */}
                <TabsContent value="tech" className="space-y-4">
                    {/* Project-level repository */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Repository</CardTitle>
                            <CardDescription>Main source-code repository for the project</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="repository">Repository URL</Label>
                                <Input
                                    id="repository"
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    value={formData.metadata.repository || ''}
                                    onChange={(e) => updateField('metadata.repository', e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank if the project uses per-service repositories
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Multi-service panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Technology Stack</CardTitle>
                            <CardDescription>
                                Add each application and service that makes up this project — web apps, mobile
                                apps, APIs, data services, etc. — and specify their individual technologies.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ServicesPanel
                                services={formData.metadata.services || []}
                                onChange={(services) => updateField('metadata.services', services)}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Architecture Tab */}
                <TabsContent value="architecture" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Architecture</CardTitle>
                            <CardDescription>System design and structure</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="arch-overview">Architecture Overview</Label>
                                <Textarea
                                    id="arch-overview"
                                    rows={3}
                                    placeholder="High-level description of your system architecture..."
                                    value={formData.metadata.architecture?.overview || ''}
                                    onChange={(e) => updateField('metadata.architecture.overview', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Architecture Style</Label>
                                <Select
                                    value={formData.metadata.architecture?.style || ''}
                                    onValueChange={(value) => updateField('metadata.architecture.style', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_METADATA_CONSTANTS.architectureStyle.map((style) => (
                                            <SelectItem key={style} value={style}>{style}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dir-structure">Directory Structure</Label>
                                <Textarea
                                    id="dir-structure"
                                    rows={4}
                                    placeholder="Describe key folders and their purposes..."
                                    value={formData.metadata.architecture?.directoryStructure || ''}
                                    onChange={(e) => updateField('metadata.architecture.directoryStructure', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>State Management</Label>
                                <TagInput
                                    value={formData.metadata.architecture?.stateManagement || []}
                                    onChange={(value) => updateField('metadata.architecture.stateManagement', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.stateManagement}
                                    placeholder="Add state management tools..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Auth & Deployment Tab */}
                <TabsContent value="auth-deploy" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Authentication & Authorization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="auth-approach">Approach</Label>
                                <Textarea
                                    id="auth-approach"
                                    rows={2}
                                    placeholder="e.g., JWT-based authentication with role-based access control..."
                                    value={formData.metadata.authStrategy?.approach || ''}
                                    onChange={(e) => updateField('metadata.authStrategy.approach', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Implementation</Label>
                                <TagInput
                                    value={formData.metadata.authStrategy?.implementation || []}
                                    onChange={(value) => updateField('metadata.authStrategy.implementation', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.authApproach}
                                    placeholder="Add auth methods..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Deployment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Environment</Label>
                                <Select
                                    value={formData.metadata.deployment?.environment || ''}
                                    onValueChange={(value) => updateField('metadata.deployment.environment', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select environment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_METADATA_CONSTANTS.deploymentEnvironment.map((env) => (
                                            <SelectItem key={env} value={env}>{env}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>CI/CD Tools</Label>
                                <TagInput
                                    value={formData.metadata.deployment?.cicd || []}
                                    onChange={(value) => updateField('metadata.deployment.cicd', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.cicdTools}
                                    placeholder="Add CI/CD tools..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Standards & Quality Tab */}
                <TabsContent value="standards" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Coding Standards</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Naming Conventions</Label>
                                <TagInput
                                    value={Array.isArray(formData.metadata.standards?.namingConventions)
                                        ? formData.metadata.standards.namingConventions
                                        : []}
                                    onChange={(value) => updateField('metadata.standards.namingConventions', value)}
                                    placeholder="e.g., camelCase for variables, PascalCase for classes..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Error Handling Patterns</Label>
                                <TagInput
                                    value={formData.metadata.standards?.errorHandling || []}
                                    onChange={(value) => updateField('metadata.standards.errorHandling', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.errorHandlingPatterns}
                                    placeholder="Add error handling patterns..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Logging Convention</Label>
                                <TagInput
                                    value={formData.metadata.standards?.loggingConvention || []}
                                    onChange={(value) => updateField('metadata.standards.loggingConvention', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.loggingTools}
                                    placeholder="Add logging tools..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quality Gates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Definition of Done</Label>
                                <TagInput
                                    value={formData.metadata.qualityGates?.definitionOfDone || []}
                                    onChange={(value) => updateField('metadata.qualityGates.definitionOfDone', value)}
                                    placeholder="Add criteria..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Code Review Checklist</Label>
                                <TagInput
                                    value={formData.metadata.qualityGates?.codeReviewChecklist || []}
                                    onChange={(value) => updateField('metadata.qualityGates.codeReviewChecklist', value)}
                                    placeholder="Add review items..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Testing Requirements</Label>
                                <TagInput
                                    value={formData.metadata.qualityGates?.testingRequirements?.testTypes || []}
                                    onChange={(value) => updateField('metadata.qualityGates.testingRequirements.testTypes', value)}
                                    suggestions={PROJECT_METADATA_CONSTANTS.testTypes}
                                    placeholder="Add test types..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Documentation Standards</Label>
                                <TagInput
                                    value={formData.metadata.qualityGates?.documentationStandards || []}
                                    onChange={(value) => updateField('metadata.qualityGates.documentationStandards', value)}
                                    placeholder="Add documentation requirements..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* External Services Tab */}
                <TabsContent value="services" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>External Services</CardTitle>
                            <CardDescription>Third-party integrations and APIs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>External services management</p>
                                <p className="text-sm mt-1">Coming soon - Add external API integrations</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Registry Tab */}
                <TabsContent value="endpoints" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>API Registry</CardTitle>
                                <CardDescription>
                                    Developed API endpoints with service metadata
                                </CardDescription>
                            </div>
                            <Button variant="outline" className="gap-2" disabled>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Scan Codebase (Coming Soon)
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {developedEndpoints.length > 0 ? (
                                <div className="space-y-3">
                                    {developedEndpoints.map((endpoint, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-lg p-4 space-y-3"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                                                            endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                                                                    endpoint.method === 'PATCH' ? 'bg-purple-100 text-purple-700' :
                                                                        endpoint.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {endpoint.method || 'GET'}
                                                        </span>
                                                        <code className="text-sm font-mono font-semibold">
                                                            {endpoint.endpoint || endpoint}
                                                        </code>
                                                    </div>
                                                    {endpoint.service && (
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                            Service: {endpoint.service}
                                                        </p>
                                                    )}
                                                    {endpoint.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {endpoint.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {(endpoint.requestSchema || endpoint.responseSchema) && (
                                                <details className="text-sm">
                                                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                                        View Schemas
                                                    </summary>
                                                    <div className="mt-2 space-y-2 pl-4">
                                                        {endpoint.requestSchema && Object.keys(endpoint.requestSchema).length > 0 && (
                                                            <div>
                                                                <p className="font-medium text-xs text-muted-foreground mb-1">Request:</p>
                                                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                                                    {JSON.stringify(endpoint.requestSchema, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                        {endpoint.responseSchema && Object.keys(endpoint.responseSchema).length > 0 && (
                                                            <div>
                                                                <p className="font-medium text-xs text-muted-foreground mb-1">Response:</p>
                                                                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                                                    {JSON.stringify(endpoint.responseSchema, null, 2)}
                                                                </pre>
                                                            </div>
                                                        )}
                                                    </div>
                                                </details>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Code2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No endpoints registered yet</p>
                                    <p className="text-sm mt-1">
                                        Endpoints will be added automatically when use cases are created
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Domain Models Tab */}
                <TabsContent value="domain" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Domain Model Catalog</CardTitle>
                                <CardDescription>
                                    Entities and models discovered in your codebase
                                </CardDescription>
                            </div>
                            <Button
                                onClick={handleScanDomainModels}
                                disabled={scanningDomain}
                                variant="outline"
                                className="gap-2"
                            >
                                {scanningDomain ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                {scanningDomain ? 'Scanning...' : 'Scan Codebase'}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DomainModelTable models={projectData?.domainCatalog} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>Manage project team and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {members.length > 0 ? (
                                <div className="space-y-3">
                                    {members.map((member) => (
                                        <div
                                            key={member.userId}
                                            className="flex items-center justify-between p-3 border rounded-md"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{member.userId}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Added {new Date(member.addedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                                                {member.role}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No team members yet</p>
                                    <p className="text-sm mt-1">Team management coming soon</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                <div className="container flex items-center justify-between h-16 px-6">
                    <div className="text-sm text-muted-foreground">
                        {!isFormValid() && (
                            <span className="text-destructive">* Fill required fields to save</span>
                        )}
                        {hasChanges() && isFormValid() && (
                            <span>Unsaved changes</span>
                        )}
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormValid() || saving || !hasChanges()}
                        size="lg"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isNewProject ? "Create Project" : "Save Changes"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
