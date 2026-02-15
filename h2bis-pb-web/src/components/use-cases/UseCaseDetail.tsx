"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Loader2, AlertCircle, Pencil, Wand2, Sparkles, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUseCase, useUpdateUseCaseWithAI } from "@/hooks/useUseCases";
import { useSelectedProject } from "@/hooks/useProject";
import { projectService } from "@/services/project.service";
import { generateUseCasePromptInstructions } from "@/lib/use-case-definitions";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UseCase } from "@/types/use-case.types";
import type { UpdateWithAIProjectContext } from "@/services/use-case.service";

interface UseCaseDetailProps {
    useCaseId: string;
    onClose: () => void;
}

export function UseCaseDetail({ useCaseId, onClose }: UseCaseDetailProps) {
    const router = useRouter();
    const { data: useCase, isLoading, error } = useUseCase(useCaseId);
    const selectedProject = useSelectedProject();
    const updateWithAIMutation = useUpdateUseCaseWithAI();
    const [activeTab, setActiveTab] = useState("overview");

    // AI Panel state
    const [aiPanelOpen, setAiPanelOpen] = useState(false);
    const [aiInstructions, setAiInstructions] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiSuccess, setAiSuccess] = useState('');
    const [projectContext, setProjectContext] = useState<UpdateWithAIProjectContext | null>(null);
    const [loadingProject, setLoadingProject] = useState(false);

    // Fetch project context when AI panel opens
    useEffect(() => {
        if (aiPanelOpen && selectedProject?.id && !projectContext) {
            loadProjectContext();
        }
    }, [aiPanelOpen, selectedProject?.id]);

    const loadProjectContext = async () => {
        if (!selectedProject?.id) return;
        setLoadingProject(true);
        try {
            const project = await projectService.getById(selectedProject.id);
            const ctx: UpdateWithAIProjectContext = {
                name: project.name,
                language: project.metadata?.language,
                framework: project.metadata?.framework,
                techStack: project.metadata?.techStack,
                architectureStyle: project.metadata?.architecture?.style,
                architectureOverview: project.metadata?.architecture?.overview,
                standards: project.metadata?.standards ? {
                    codingStyle: project.metadata.standards.codingStyle,
                    namingConventions: project.metadata.standards.namingConventions,
                    errorHandling: project.metadata.standards.errorHandling,
                    loggingConvention: project.metadata.standards.loggingConvention,
                } : undefined,
                qualityGates: project.metadata?.qualityGates ? {
                    definitionOfDone: project.metadata.qualityGates.definitionOfDone,
                    testTypes: project.metadata.qualityGates.testingRequirements?.testTypes,
                } : undefined,
                authStrategy: project.metadata?.authStrategy,
                domainCatalog: project.metadata?.domainCatalog?.map((e: any) => ({
                    name: e.name,
                    description: e.description,
                    fields: e.fields?.map((f: any) => ({ name: f.name, type: f.type })),
                })),
            };
            setProjectContext(ctx);
        } catch (err) {
            console.error('Failed to load project context:', err);
        } finally {
            setLoadingProject(false);
        }
    };

    const handleUpdateWithAI = async () => {
        if (!aiInstructions.trim()) {
            setAiError('Please describe what you want to change');
            return;
        }

        setIsUpdating(true);
        setAiError('');
        setAiSuccess('');

        try {
            const systemInstructions = generateUseCasePromptInstructions();
            const fullInstructions = `${aiInstructions}\n\n${systemInstructions}`;

            const response = await updateWithAIMutation.mutateAsync({
                useCaseId,
                instructions: fullInstructions,
                projectContext: projectContext || undefined,
            });

            setAiSuccess(`Use case updated successfully! ${response.updatedFields?.length || 0} fields modified.`);
            setAiInstructions('');

            // Clear success after 5 seconds
            setTimeout(() => setAiSuccess(''), 5000);
        } catch (error: any) {
            console.error('AI Update failed:', error);
            setAiError(error.message || 'Failed to update use case with AI. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="h-full">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading details...</span>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center py-12 text-destructive">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <p className="font-semibold">Failed to load use case details</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {error.message || 'An unexpected error occurred'}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (!useCase) {
        return null;
    }

    return (
        <Card className="h-full flex flex-col">
            {/* Header with actions */}
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex-1">
                    <CardTitle className="text-2xl">{useCase.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Key: {useCase.key}</p>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant={aiPanelOpen ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAiPanelOpen(!aiPanelOpen)}
                        title="Update with AI"
                        className="gap-1.5"
                    >
                        <Wand2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Update with AI</span>
                        {aiPanelOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(ROUTES.USE_CASE_EDIT(useCaseId))}
                        title="Edit"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        title="Close"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {/* AI Update Panel - Collapsible, visible on all tabs */}
            {aiPanelOpen && (
                <div className="mx-4 mb-3">
                    <div className="border rounded-lg bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold">Update with AI</span>
                            {loadingProject && (
                                <Badge variant="outline" className="text-xs gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Loading project context...
                                </Badge>
                            )}
                            {projectContext && !loadingProject && (
                                <Badge variant="outline" className="text-xs text-green-600 bg-green-500/10 border-green-500/20">
                                    Project context loaded
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ai-update-instructions" className="text-xs text-muted-foreground">
                                Describe what you want to change (AI will respect project constraints)
                            </Label>
                            <Textarea
                                id="ai-update-instructions"
                                placeholder="e.g., Add error handling flows for authentication failures, improve the acceptance criteria, add security considerations for JWT token handling..."
                                value={aiInstructions}
                                onChange={(e) => {
                                    setAiInstructions(e.target.value);
                                    setAiError('');
                                }}
                                rows={3}
                                className="resize-none text-sm"
                                disabled={isUpdating}
                            />
                        </div>

                        {/* Error Display */}
                        {aiError && (
                            <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20">
                                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-destructive">{aiError}</p>
                            </div>
                        )}

                        {/* Success Display */}
                        {aiSuccess && (
                            <div className="flex items-start gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20">
                                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-green-600">{aiSuccess}</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                                Changes are saved automatically after AI processing
                            </p>
                            <Button
                                size="sm"
                                onClick={handleUpdateWithAI}
                                disabled={isUpdating || !aiInstructions.trim()}
                                className="gap-1.5"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Update with AI
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabbed Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 mx-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                    <TabsTrigger value="flows">Flows</TabsTrigger>
                    <TabsTrigger value="technical">Technical</TabsTrigger>
                    <TabsTrigger value="interfaces">Interfaces</TabsTrigger>
                    <TabsTrigger value="domain">Domain</TabsTrigger>
                    <TabsTrigger value="architecture">Architecture</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="relationships">Relations</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {/* Status badges */}
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant={
                                useCase.status.lifecycle === 'completed'
                                    ? 'default'
                                    : useCase.status.lifecycle === 'in_development'
                                        ? 'secondary'
                                        : 'outline'
                            }
                        >
                            {useCase.status.lifecycle}
                        </Badge>
                        {useCase.status.generatedByAI && (
                            <Badge variant="outline">AI Generated</Badge>
                        )}
                        {useCase.aiMetadata?.estimatedComplexity && (
                            <Badge variant="secondary" className="capitalize">
                                {useCase.aiMetadata.estimatedComplexity} Complexity
                            </Badge>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    </div>

                    {/* Actors */}
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Actors</h3>
                        <p className="text-sm"><span className="font-medium">Primary:</span> {useCase.primaryActor}</p>
                        {useCase.stakeholders && useCase.stakeholders.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-medium mb-1">Stakeholders:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    {useCase.stakeholders.map((stakeholder, index) => (
                                        <li key={index} className="text-sm text-muted-foreground">{stakeholder}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Business Value */}
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Business Value</h3>
                        <p className="text-sm text-muted-foreground">{useCase.businessValue}</p>
                    </div>

                    {/* Tags */}
                    {useCase.tags && useCase.tags.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-1">
                                {useCase.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>

                {/* Requirements Tab */}
                <TabsContent value="requirements" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {/* Functional Requirements */}
                    {useCase.functionalRequirements && (
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm mb-4">Functional Requirements</h3>
                            <div className="space-y-4">
                                {useCase.functionalRequirements.must && useCase.functionalRequirements.must.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-green-600 mb-1">Must Have</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.functionalRequirements.must.map((req, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.functionalRequirements.should && useCase.functionalRequirements.should.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600 mb-1">Should Have</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.functionalRequirements.should.map((req, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.functionalRequirements.wont && useCase.functionalRequirements.wont.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-red-600 mb-1">Won't Have</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.functionalRequirements.wont.map((req, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Acceptance Criteria */}
                    {useCase.acceptanceCriteria && useCase.acceptanceCriteria.length > 0 && (
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm mb-3">Acceptance Criteria</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {useCase.acceptanceCriteria.map((criterion, index) => (
                                    <li key={index} className="text-sm text-muted-foreground">{criterion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Scope */}
                    {useCase.scope && (
                        <div className="space-y-1">
                            <h3 className="font-semibold text-sm mb-4">Scope</h3>
                            <div className="space-y-4">
                                {useCase.scope.inScope && useCase.scope.inScope.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">In Scope</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.scope.inScope.map((item, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.scope.outOfScope && useCase.scope.outOfScope.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Out of Scope</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.scope.outOfScope.map((item, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.scope.assumptions && useCase.scope.assumptions.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Assumptions</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.scope.assumptions.map((item, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.scope.constraints && useCase.scope.constraints.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Constraints</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.scope.constraints.map((item, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!useCase.functionalRequirements && !useCase.acceptanceCriteria?.length && !useCase.scope && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No requirements defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Flows Tab */}
                <TabsContent value="flows" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {useCase.flows && useCase.flows.length > 0 ? (
                        <div className="space-y-4">
                            {useCase.flows.map((flow, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "border-l-2 pl-3",
                                        flow.type === "main"
                                            ? "border-primary"
                                            : flow.type === "alternative"
                                                ? "border-muted"
                                                : "border-destructive"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium">{flow.name}</p>
                                        <Badge variant="outline" className="text-xs">
                                            {flow.type}
                                        </Badge>
                                    </div>
                                    <ol className="list-decimal list-inside space-y-1">
                                        {flow.steps.map((step, stepIndex) => (
                                            <li key={stepIndex} className="text-sm text-muted-foreground">{step}</li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No flows defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Technical Surface Tab */}
                <TabsContent value="technical" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {/* Backend */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Backend</h3>
                        <div className="space-y-3">
                            {useCase.technicalSurface?.backend?.repos && useCase.technicalSurface.backend.repos.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Repositories</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.technicalSurface.backend.repos.map((repo, index) => (
                                            <li key={index} className="text-sm text-muted-foreground">{repo}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {useCase.technicalSurface?.backend?.endpoints && useCase.technicalSurface.backend.endpoints.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Endpoints</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.technicalSurface.backend.endpoints.map((endpoint, index) => (
                                            <li key={index} className="text-sm text-muted-foreground font-mono">{endpoint}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {useCase.technicalSurface?.backend?.collections && useCase.technicalSurface.backend.collections.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Data Collections</p>
                                    <div className="space-y-2">
                                        {useCase.technicalSurface.backend.collections.map((collection, index) => (
                                            <div key={index} className="border rounded p-2">
                                                <p className="text-sm font-medium">{collection.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{collection.purpose}</p>
                                                <div className="flex gap-1 mt-1">
                                                    {collection.operations.map((op) => (
                                                        <Badge key={op} variant="secondary" className="text-xs">{op}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Frontend */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">Frontend</h3>
                        <div className="space-y-3">
                            {useCase.technicalSurface?.frontend?.repos && useCase.technicalSurface.frontend.repos.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Repositories</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.technicalSurface.frontend.repos.map((repo, index) => (
                                            <li key={index} className="text-sm text-muted-foreground">{repo}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {useCase.technicalSurface?.frontend?.routes && useCase.technicalSurface.frontend.routes.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Routes</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.technicalSurface.frontend.routes.map((route, index) => (
                                            <li key={index} className="text-sm text-muted-foreground font-mono">{route}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {useCase.technicalSurface?.frontend?.components && useCase.technicalSurface.frontend.components.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium mb-1">Components</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.technicalSurface.frontend.components.map((component, index) => (
                                            <li key={index} className="text-sm text-muted-foreground font-mono">{component}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {!useCase.technicalSurface?.backend?.repos?.length && !useCase.technicalSurface?.frontend?.repos?.length && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No technical surface defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Interfaces & API Tab */}
                <TabsContent value="interfaces" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {useCase.interfaces ? (
                        <>
                            <div>
                                <h3 className="font-semibold text-sm mb-2">Interface Type</h3>
                                <Badge variant="outline">{useCase.interfaces.type}</Badge>
                            </div>

                            {useCase.interfaces.endpoints && useCase.interfaces.endpoints.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">API Endpoints</h3>
                                    <div className="space-y-3">
                                        {useCase.interfaces.endpoints.map((endpoint, index) => (
                                            <div key={index} className="border rounded p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            endpoint.method === 'GET' && 'bg-blue-100 text-blue-700',
                                                            endpoint.method === 'POST' && 'bg-green-100 text-green-700',
                                                            endpoint.method === 'PUT' && 'bg-yellow-100 text-yellow-700',
                                                            endpoint.method === 'PATCH' && 'bg-purple-100 text-purple-700',
                                                            endpoint.method === 'DELETE' && 'bg-red-100 text-red-700'
                                                        )}
                                                    >
                                                        {endpoint.method}
                                                    </Badge>
                                                    <code className="text-sm font-mono">{endpoint.path}</code>
                                                </div>
                                                {endpoint.request && (
                                                    <div className="mt-2">
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Request:</p>
                                                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{endpoint.request}</pre>
                                                    </div>
                                                )}
                                                {endpoint.response && (
                                                    <div className="mt-2">
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">Response:</p>
                                                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{endpoint.response}</pre>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {useCase.interfaces.events && useCase.interfaces.events.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm mb-2">Events</h3>
                                    <ul className="list-disc list-inside space-y-1">
                                        {useCase.interfaces.events.map((event, index) => (
                                            <li key={index} className="text-sm text-muted-foreground font-mono">{event}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No interfaces defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Domain Model Tab */}
                <TabsContent value="domain" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {useCase.domainModel?.entities && useCase.domainModel.entities.length > 0 ? (
                        <div className="space-y-4">
                            {useCase.domainModel.entities.map((entity, index) => (
                                <div key={index} className="border rounded p-3">
                                    <h4 className="font-semibold text-sm mb-1">{entity.name}</h4>
                                    {entity.description && (
                                        <p className="text-xs text-muted-foreground mb-2">{entity.description}</p>
                                    )}
                                    {entity.fields && entity.fields.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-medium mb-2">Fields:</p>
                                            <div className="space-y-2">
                                                {entity.fields.map((field, fieldIndex) => (
                                                    <div key={fieldIndex} className="flex items-start gap-2 text-xs">
                                                        <code className="font-mono">{field.name}</code>
                                                        <span className="text-muted-foreground">:</span>
                                                        <span className="text-primary font-mono">{field.type}</span>
                                                        {field.required && (
                                                            <Badge variant="outline" className="text-xs">required</Badge>
                                                        )}
                                                        {field.constraints && field.constraints.length > 0 && (
                                                            <span className="text-muted-foreground text-xs">
                                                                ({field.constraints.join(', ')})
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No domain model defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Architecture & Tech Tab */}
                <TabsContent value="architecture" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {/* Architecture Style */}
                    {useCase.architecture && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Architecture</h3>
                            <div className="space-y-2">
                                {useCase.architecture.style && (
                                    <p className="text-sm"><span className="font-medium">Style:</span> {useCase.architecture.style}</p>
                                )}
                                {useCase.architecture.patterns && useCase.architecture.patterns.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Additional Patterns:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {useCase.architecture.patterns.map((pattern, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">{pattern}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Technology Constraints */}
                    {useCase.technologyConstraints && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Technology Constraints</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {useCase.technologyConstraints.backend && (
                                    <p className="text-sm"><span className="font-medium">Backend:</span> {useCase.technologyConstraints.backend}</p>
                                )}
                                {useCase.technologyConstraints.frontend && (
                                    <p className="text-sm"><span className="font-medium">Frontend:</span> {useCase.technologyConstraints.frontend}</p>
                                )}
                                {useCase.technologyConstraints.database && (
                                    <p className="text-sm"><span className="font-medium">Database:</span> {useCase.technologyConstraints.database}</p>
                                )}
                                {useCase.technologyConstraints.messaging && (
                                    <p className="text-sm"><span className="font-medium">Messaging:</span> {useCase.technologyConstraints.messaging}</p>
                                )}
                                {useCase.technologyConstraints.auth && (
                                    <p className="text-sm"><span className="font-medium">Auth:</span> {useCase.technologyConstraints.auth}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error Handling */}
                    {useCase.errorHandling?.knownErrors && useCase.errorHandling.knownErrors.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm mb-2">Error Handling</h3>
                            <div className="space-y-2">
                                {useCase.errorHandling.knownErrors.map((error, index) => (
                                    <div key={index} className="border rounded p-2">
                                        <p className="text-sm font-medium">{error.condition}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{error.expectedBehavior}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!useCase.architecture && !useCase.technologyConstraints && !useCase.errorHandling?.knownErrors?.length && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No architecture information defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Quality Tab */}
                <TabsContent value="quality" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {/* Configuration */}
                    {useCase.configuration && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Configuration</h3>
                            <div className="space-y-3">
                                {useCase.configuration.envVars && useCase.configuration.envVars.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Environment Variables</p>
                                        <div className="flex flex-wrap gap-1">
                                            {useCase.configuration.envVars.map((envVar, index) => (
                                                <Badge key={index} variant="outline" className="text-xs font-mono">{envVar}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {useCase.configuration.featureFlags && useCase.configuration.featureFlags.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Feature Flags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {useCase.configuration.featureFlags.map((flag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs font-mono">{flag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quality */}
                    {useCase.quality && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Quality Metrics</h3>
                            <div className="space-y-3">
                                {useCase.quality.testTypes && useCase.quality.testTypes.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Test Types</p>
                                        <div className="flex flex-wrap gap-1">
                                            {useCase.quality.testTypes.map((testType) => (
                                                <Badge key={testType} variant="secondary" className="text-xs">{testType}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {useCase.quality.performanceCriteria && useCase.quality.performanceCriteria.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Performance Criteria</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.quality.performanceCriteria.map((criteria, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{criteria}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.quality.securityConsiderations && useCase.quality.securityConsiderations.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-1">Security Considerations</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.quality.securityConsiderations.map((security, index) => (
                                                <li key={index} className="text-sm text-muted-foreground">{security}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* AI Metadata */}
                    {useCase.aiMetadata && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3">AI Metadata</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Complexity:</span> <span className="capitalize">{useCase.aiMetadata.estimatedComplexity}</span></p>
                                {useCase.aiMetadata.suggestedOrder && (
                                    <p><span className="font-medium">Suggested Order:</span> {useCase.aiMetadata.suggestedOrder}</p>
                                )}
                                {useCase.aiMetadata.implementationRisk && useCase.aiMetadata.implementationRisk.length > 0 && (
                                    <div>
                                        <p className="font-medium mb-1">Implementation Risks:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.aiMetadata.implementationRisk.map((risk, index) => (
                                                <li key={index} className="text-muted-foreground">{risk}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.aiMetadata.testStrategy && useCase.aiMetadata.testStrategy.length > 0 && (
                                    <div>
                                        <p className="font-medium mb-1">Test Strategy:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.aiMetadata.testStrategy.map((strategy, index) => (
                                                <li key={index} className="text-muted-foreground">{strategy}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {useCase.aiMetadata.nonFunctionalRequirements && useCase.aiMetadata.nonFunctionalRequirements.length > 0 && (
                                    <div>
                                        <p className="font-medium mb-1">Non-Functional Requirements:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {useCase.aiMetadata.nonFunctionalRequirements.map((nfr, index) => (
                                                <li key={index} className="text-muted-foreground">{nfr}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!useCase.configuration && !useCase.quality && !useCase.aiMetadata && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No quality information defined</p>
                        </div>
                    )}
                </TabsContent>

                {/* Relationships Tab */}
                <TabsContent value="relationships" className="flex-1 overflow-y-auto px-4 space-y-6">
                    {useCase.relationships && useCase.relationships.length > 0 ? (
                        <div className="space-y-3">
                            {useCase.relationships.map((relationship, index) => (
                                <div key={index} className="border rounded p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">{relationship.type}</Badge>
                                        <span className="text-sm font-mono">{relationship.targetType}:{relationship.targetKey}</span>
                                    </div>
                                    {relationship.reason && (
                                        <p className="text-xs text-muted-foreground mt-1">{relationship.reason}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No relationships defined</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </Card>
    );
}
