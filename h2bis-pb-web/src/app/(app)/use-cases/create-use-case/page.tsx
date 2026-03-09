'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Loader2, Sparkles, AlertCircle, Zap, Trash2 } from 'lucide-react';
import { useCreateUseCase } from '@/hooks/useUseCases';
import { useCaseService, type CreateUseCaseRequest } from '@/services/use-case.service';
import { generateUseCasePromptInstructions } from '@/lib/use-case-definitions';
import { useSelectedProject } from '@/hooks/useProject';

export default function NewUseCasePage() {
    const router = useRouter();
    const createMutation = useCreateUseCase();
    const selectedProject = useSelectedProject();

    // Form state
    const [key, setKey] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [businessValue, setBusinessValue] = useState('');
    const [primaryActor, setPrimaryActor] = useState('');

    // Technical Surface
    const [backendRepos, setBackendRepos] = useState<string[]>(['']);
    const [frontendRepos, setFrontendRepos] = useState<string[]>(['']);
    const [endpoints, setEndpoints] = useState<string[]>(['']);
    const [routes, setRoutes] = useState<string[]>(['']);
    const [components, setComponents] = useState<string[]>(['']);

    // Optional fields
    const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);
    const [stakeholders, setStakeholders] = useState<string[]>([]);

    // Requirements
    const [functionalReqs, setFunctionalReqs] = useState<{ must: string[], should: string[], wont: string[] }>({
        must: [''], should: [''], wont: ['']
    });

    // Scope
    const [scope, setScope] = useState<{ inScope: string[], outOfScope: string[], assumptions: string[], constraints: string[] }>({
        inScope: [''], outOfScope: [''], assumptions: [''], constraints: ['']
    });

    // Interfaces
    const [interfaceType, setInterfaceType] = useState<'REST' | 'GraphQL' | 'Event' | 'UI'>('REST');
    const [interfaceEndpoints, setInterfaceEndpoints] = useState<Array<{ method: string, path: string, request: string, response: string }>>([]);
    const [interfaceEvents, setInterfaceEvents] = useState<string[]>([]);

    // Config & Quality
    const [testTypes, setTestTypes] = useState<Array<'unit' | 'integration' | 'e2e' | 'security'>>(['unit']);
    const [perfCriteria, setPerfCriteria] = useState<string[]>([]);
    const [secConsiderations, setSecConsiderations] = useState<string[]>([]);

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
    const [lifecycle, setLifecycle] = useState('idea');

    // AI Generation state
    const [aiDescription, setAiDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState('');
    const [fieldOrigins, setFieldOrigins] = useState<Record<string, 'user' | 'ai'>>({});

    // Field Origin Indicator Component
    const FieldOriginBadge = ({ field }: { field: string }) => {
        const origin = fieldOrigins[field];
        if (!origin) return null;

        return (
            <Badge
                variant={origin === 'ai' ? 'default' : 'secondary'}
                className={`text-xs ${origin === 'ai' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}
            >
                {origin === 'ai' ? '✨ AI' : '👤 You'}
            </Badge>
        );
    };

    const handleAddItem = (list: string[], setList: (val: string[]) => void) => {
        setList([...list, '']);
    };

    const handleRemoveItem = (index: number, list: string[], setList: (val: string[]) => void) => {
        setList(list.filter((_, i) => i !== index));
    };

    const handleUpdateItem = (index: number, value: string, list: string[], setList: (val: string[]) => void) => {
        const newList = [...list];
        newList[index] = value;
        setList(newList);
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const updateFormWithGeneratedData = (generated: any) => {
        const update = (field: string, setter: Function, val: any) => {
            if (val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
                setter(val);
                setFieldOrigins(prev => ({ ...prev, [field]: 'ai' }));
            }
        };

        update('key', setKey, generated.key);
        update('name', setName, generated.name);
        update('description', setDescription, generated.description);
        update('businessValue', setBusinessValue, generated.businessValue);
        update('primaryActor', setPrimaryActor, generated.primaryActor);

        // Technical surface mapping
        if (generated.technicalSurface) {
            const ts = generated.technicalSurface;
            if (ts.backend) {
                update('backendRepos', setBackendRepos, ts.backend.repos);
                update('endpoints', setEndpoints, ts.backend.endpoints);
            }
            if (ts.frontend) {
                update('frontendRepos', setFrontendRepos, ts.frontend.repos);
                update('routes', setRoutes, ts.frontend.routes);
                update('components', setComponents, ts.frontend.components);
            }
        }

        update('acceptanceCriteria', setAcceptanceCriteria, generated.acceptanceCriteria);
        update('stakeholders', setStakeholders, generated.stakeholders);

        if (generated.functionalRequirements) {
            update('functionalReqs', setFunctionalReqs, generated.functionalRequirements);
        }
        if (generated.scope) {
            update('scope', setScope, generated.scope);
        }
        if (generated.interfaces) {
            if (generated.interfaces.type) setInterfaceType(generated.interfaces.type);
            if (generated.interfaces.endpoints) setInterfaceEndpoints(generated.interfaces.endpoints);
            if (generated.interfaces.events) setInterfaceEvents(generated.interfaces.events);
        }
        if (generated.quality) {
            if (generated.quality.testTypes) setTestTypes(generated.quality.testTypes);
            if (generated.quality.performanceCriteria) setPerfCriteria(generated.quality.performanceCriteria);
            if (generated.quality.securityConsiderations) setSecConsiderations(generated.quality.securityConsiderations);
        }

        if (generated.status?.lifecycle) setLifecycle(generated.status.lifecycle);
    };

    const handleGenerateWithDescriptionOnly = async () => {
        if (!aiDescription.trim()) {
            setGenerationError('Please provide a description for AI generation');
            return;
        }

        setIsGenerating(true);
        setGenerationError('');

        try {
            // Call API with enhanced prompt
            const systemInstructions = generateUseCasePromptInstructions();
            const fullDescription = `${aiDescription}\n\n${systemInstructions}`;

            const response = await useCaseService.generate({
                description: fullDescription,
                projectId: selectedProject?.id
            });

            // Update form with result
            updateFormWithGeneratedData(response.useCase);
            setGenerationError('');

        } catch (error: any) {
            console.error('AI Generation failed:', error);
            const errorMsg = error.response?.data?.message 
                || error.message 
                || 'Failed to generate use case. AI service may be unavailable. Try filling the form manually.';
            setGenerationError(errorMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateWithManualData = async () => {
        if (!aiDescription.trim()) {
            setGenerationError('Please provide a description for AI generation');
            return;
        }

        setIsGenerating(true);
        setGenerationError('');

        try {
            // Collect existing data
            const existingData: Partial<CreateUseCaseRequest> = {
                key, name, description, businessValue, primaryActor,
                technicalSurface: {
                    backend: {
                        repos: backendRepos.filter(r => r.trim()),
                        endpoints: endpoints.filter(e => e.trim())
                    },
                    frontend: {
                        repos: frontendRepos.filter(r => r.trim()),
                        routes: routes.filter(r => r.trim()),
                        components: components.filter(c => c.trim())
                    }
                },
                acceptanceCriteria: acceptanceCriteria.filter(ac => ac.trim())
            };

            // Call API with existing data and enhanced prompt
            const systemInstructions = generateUseCasePromptInstructions();
            const fullDescription = `${aiDescription}\n\n${systemInstructions}`;

            const response = await useCaseService.generate({
                description: fullDescription,
                projectId: selectedProject?.id,
                existingData
            });

            // Update form with result (AI agent respects existing data)
            updateFormWithGeneratedData(response.useCase);

        } catch (error: any) {
            console.error('AI Generation failed:', error);
            const errorMsg = error.response?.data?.message 
                || error.message 
                || 'Failed to generate use case. AI service may be unavailable. Try filling the form manually.';
            setGenerationError(errorMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    // Track manual user input
    const handleUserInput = (field: string, setter: Function, value: any) => {
        setter(value);
        if (value && (typeof value === 'string' ? value.trim() : true)) {
            setFieldOrigins(prev => ({ ...prev, [field]: 'user' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate project selection
        if (!selectedProject) {
            console.error('No project selected');
            return;
        }

        // Build request with all required and optional fields
        const request: CreateUseCaseRequest = {
            projectId: selectedProject.id,
            type: 'use_case',
            key: key.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            name,
            description,
            businessValue,
            primaryActor,
            technicalSurface: {
                backend: {
                    repos: backendRepos.filter(r => r.trim()),
                    endpoints: endpoints.filter(e => e.trim()),
                    collections: [] // Default empty - can be added to UI later
                },
                frontend: {
                    repos: frontendRepos.filter(r => r.trim()),
                    routes: routes.filter(r => r.trim()),
                    components: components.filter(c => c.trim()),
                }
            },
            acceptanceCriteria: acceptanceCriteria.filter(ac => ac.trim()),
            tags,
            normative: false, // Default to false - can be added to UI later
            aiMetadata: {
                estimatedComplexity: complexity
            },
            status: {
                lifecycle,
                reviewedByHuman: true,
                generatedByAI: !!Object.keys(fieldOrigins).find(k => fieldOrigins[k] === 'ai')
            },
            stakeholders: stakeholders.filter(s => s.trim()),
            functionalRequirements: {
                must: functionalReqs.must.filter(s => s.trim()),
                should: functionalReqs.should.filter(s => s.trim()),
                wont: functionalReqs.wont.filter(s => s.trim())
            },
            scope: {
                inScope: scope.inScope.filter(s => s.trim()),
                outOfScope: scope.outOfScope.filter(s => s.trim()),
                assumptions: scope.assumptions.filter(s => s.trim()),
                constraints: scope.constraints.filter(s => s.trim())
            },
            interfaces: {
                type: interfaceType,
                endpoints: interfaceEndpoints.filter(e => e.path.trim()),
                events: interfaceEvents.filter(e => e.trim())
            },
            errorHandling: {
                knownErrors: [] // Default empty - can be added to UI later
            },
            quality: {
                testTypes,
                performanceCriteria: perfCriteria.filter(c => c.trim()),
                securityConsiderations: secConsiderations.filter(c => c.trim())
            },
            flows: [], // Default empty - can be added to UI later
            relationships: [], // Default empty - can be added to UI later
            implementationRisk: [] // Default empty - can be added to UI later
        };

        createMutation.mutate(request);
    };

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4 max-w-7xl">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Use Case</h1>
                    <p className="text-muted-foreground mt-1">
                        Define a new use case manually or generate with AI
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {createMutation.isError && (
                <Card className="border-destructive max-w-7xl">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div className="space-y-2 flex-1">
                                <p className="text-destructive font-semibold">
                                    Failed to create use case
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {createMutation.error.message || 'An unexpected error occurred'}
                                </p>
                                {createMutation.error.message?.includes('already exists') && (
                                    <div className="mt-3 p-3 bg-muted rounded-md">
                                        <p className="text-sm font-medium mb-2">💡 Suggestions:</p>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                            <li>Modify the "Key" field below to make it unique (e.g., add a version number or timestamp)</li>
                                            <li>Or go back to the use cases list and update the existing use case instead</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No Project Selected Warning */}
            {!selectedProject && (
                <Card className="border-yellow-500 max-w-7xl">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div className="space-y-2 flex-1">
                                <p className="text-yellow-700 font-semibold">
                                    No project selected
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Please select a project from the project selector in the header before creating a use case.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Split Container: Form (Left) + AI Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
                {/* LEFT SIDE - Form (60% width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue="general" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                                <TabsTrigger value="scope">Scope & Domain</TabsTrigger>
                                <TabsTrigger value="technical">Technical</TabsTrigger>
                                <TabsTrigger value="quality">Quality & Config</TabsTrigger>
                            </TabsList>

                            {/* GENERAL TAB */}
                            <TabsContent value="general" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                        <CardDescription>Essential details about the use case</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="key">Key <span className="text-destructive">*</span></Label>
                                                    <FieldOriginBadge field="key" />
                                                </div>
                                                <Input id="key" placeholder="e.g., uc-user-login" value={key} onChange={(e) => handleUserInput('key', setKey, e.target.value)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                                    <FieldOriginBadge field="name" />
                                                </div>
                                                <Input id="name" placeholder="e.g., User Login" value={name} onChange={(e) => handleUserInput('name', setName, e.target.value)} required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                            <Textarea id="description" placeholder="Describe what this use case does..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="businessValue">Business Value <span className="text-destructive">*</span></Label>
                                            <Textarea id="businessValue" placeholder="Explain the business value..." value={businessValue} onChange={(e) => setBusinessValue(e.target.value)} rows={2} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="primaryActor">Primary Actor <span className="text-destructive">*</span></Label>
                                                <Input id="primaryActor" placeholder="e.g., End User" value={primaryActor} onChange={(e) => setPrimaryActor(e.target.value)} required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="complexity">Complexity</Label>
                                                <Select value={complexity} onValueChange={(v: any) => setComplexity(v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lifecycle Status</Label>
                                            <Select value={lifecycle} onValueChange={setLifecycle}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="idea">Idea</SelectItem>
                                                    <SelectItem value="planned">Planned</SelectItem>
                                                    <SelectItem value="in_development">In Development</SelectItem>
                                                    <SelectItem value="ai_generated">AI Generated</SelectItem>
                                                    <SelectItem value="human_reviewed">Human Reviewed</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Stakeholders</Label>
                                            {stakeholders.map((person, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <Input placeholder="e.g., Product Owner" value={person} onChange={(e) => handleUpdateItem(index, e.target.value, stakeholders, setStakeholders)} />
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index, stakeholders, setStakeholders)}><X className="h-4 w-4" /></Button>
                                                </div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem(stakeholders, setStakeholders)}><Plus className="h-4 w-4 mr-2" /> Add Stakeholder</Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Tags</Label>
                                            <div className="flex gap-2">
                                                <Input placeholder="e.g., auth" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} />
                                                <Button type="button" variant="outline" onClick={handleAddTag}>Add</Button>
                                            </div>
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="gap-1">{tag} <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive"><X className="h-3 w-3" /></button></Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* REQUIREMENTS TAB */}
                            <TabsContent value="requirements" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Functional Requirements</CardTitle>
                                        <CardDescription>What the system must, should, and won't do (MoSCoW method)</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-3">
                                            <Label className="text-green-600">Must Have</Label>
                                            {functionalReqs.must.map((req, i) => (
                                                <div key={i} className="flex gap-2"><Input value={req} onChange={(e) => { const newL = [...functionalReqs.must]; newL[i] = e.target.value; setFunctionalReqs({ ...functionalReqs, must: newL }); }} /><Button type="button" variant="ghost" size="icon" onClick={() => { const newL = functionalReqs.must.filter((_, idx) => idx !== i); setFunctionalReqs({ ...functionalReqs, must: newL }); }}><X className="h-4 w-4" /></Button></div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => setFunctionalReqs({ ...functionalReqs, must: [...functionalReqs.must, ''] })}><Plus className="h-4 w-4 mr-2" /> Add Must Have</Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-yellow-600">Should Have</Label>
                                            {functionalReqs.should.map((req, i) => (
                                                <div key={i} className="flex gap-2"><Input value={req} onChange={(e) => { const newL = [...functionalReqs.should]; newL[i] = e.target.value; setFunctionalReqs({ ...functionalReqs, should: newL }); }} /><Button type="button" variant="ghost" size="icon" onClick={() => { const newL = functionalReqs.should.filter((_, idx) => idx !== i); setFunctionalReqs({ ...functionalReqs, should: newL }); }}><X className="h-4 w-4" /></Button></div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => setFunctionalReqs({ ...functionalReqs, should: [...functionalReqs.should, ''] })}><Plus className="h-4 w-4 mr-2" /> Add Should Have</Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-red-600">Won't Have</Label>
                                            {functionalReqs.wont.map((req, i) => (
                                                <div key={i} className="flex gap-2"><Input value={req} onChange={(e) => { const newL = [...functionalReqs.wont]; newL[i] = e.target.value; setFunctionalReqs({ ...functionalReqs, wont: newL }); }} /><Button type="button" variant="ghost" size="icon" onClick={() => { const newL = functionalReqs.wont.filter((_, idx) => idx !== i); setFunctionalReqs({ ...functionalReqs, wont: newL }); }}><X className="h-4 w-4" /></Button></div>
                                            ))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => setFunctionalReqs({ ...functionalReqs, wont: [...functionalReqs.wont, ''] })}><Plus className="h-4 w-4 mr-2" /> Add Won't Have</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Acceptance Criteria</CardTitle>
                                        <CardDescription>Conditions that must be met</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {acceptanceCriteria.map((criteria, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input placeholder="e.g., User can log in..." value={criteria} onChange={(e) => handleUpdateItem(index, e.target.value, acceptanceCriteria, setAcceptanceCriteria)} />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index, acceptanceCriteria, setAcceptanceCriteria)}><X className="h-4 w-4" /></Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem(acceptanceCriteria, setAcceptanceCriteria)}><Plus className="h-4 w-4 mr-2" /> Add Criterion</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* SCOPE & DOMAIN TAB */}
                            <TabsContent value="scope" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader><CardTitle>Project Scope</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <Label>In Scope</Label>
                                                {scope.inScope.map((s, i) => (
                                                    <div key={i} className="flex gap-2"><Input value={s} onChange={(e) => { const n = [...scope.inScope]; n[i] = e.target.value; setScope({ ...scope, inScope: n }); }} /><Button type="button" variant="ghost" size="icon" onClick={() => { setScope({ ...scope, inScope: scope.inScope.filter((_, idx) => idx !== i) }); }}><X className="h-4 w-4" /></Button></div>
                                                ))}
                                                <Button type="button" variant="outline" size="sm" onClick={() => setScope({ ...scope, inScope: [...scope.inScope, ''] })}><Plus className="h-4 w-4 mr-2" /> Add In Scope</Button>
                                            </div>
                                            <div className="space-y-3">
                                                <Label>Out of Scope</Label>
                                                {scope.outOfScope.map((s, i) => (
                                                    <div key={i} className="flex gap-2"><Input value={s} onChange={(e) => { const n = [...scope.outOfScope]; n[i] = e.target.value; setScope({ ...scope, outOfScope: n }); }} /><Button type="button" variant="ghost" size="icon" onClick={() => { setScope({ ...scope, outOfScope: scope.outOfScope.filter((_, idx) => idx !== i) }); }}><X className="h-4 w-4" /></Button></div>
                                                ))}
                                                <Button type="button" variant="outline" size="sm" onClick={() => setScope({ ...scope, outOfScope: [...scope.outOfScope, ''] })}><Plus className="h-4 w-4 mr-2" /> Add Out of Scope</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* TECHNICAL TAB */}
                            <TabsContent value="technical" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader><CardTitle>Technical Surface</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-3">
                                            <Label>Backend Repos <span className="text-destructive">*</span></Label>
                                            {backendRepos.map((repo, i) => (<div key={i} className="flex gap-2"><Input value={repo} onChange={(e) => handleUpdateItem(i, e.target.value, backendRepos, setBackendRepos)} required={i === 0} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(i, backendRepos, setBackendRepos)}><X className="h-4 w-4" /></Button></div>))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem(backendRepos, setBackendRepos)}><Plus className="h-4 w-4 mr-2" /> Add Repo</Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Frontend Repos <span className="text-destructive">*</span></Label>
                                            {frontendRepos.map((repo, i) => (<div key={i} className="flex gap-2"><Input value={repo} onChange={(e) => handleUpdateItem(i, e.target.value, frontendRepos, setFrontendRepos)} required={i === 0} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(i, frontendRepos, setFrontendRepos)}><X className="h-4 w-4" /></Button></div>))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem(frontendRepos, setFrontendRepos)}><Plus className="h-4 w-4 mr-2" /> Add Repo</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Interfaces</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select value={interfaceType} onValueChange={(v: any) => setInterfaceType(v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent><SelectItem value="REST">REST</SelectItem><SelectItem value="GraphQL">GraphQL</SelectItem><SelectItem value="Event">Event</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                        <Label>Endpoints</Label>
                                        {interfaceEndpoints.map((ep, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-2">
                                                <div className="col-span-3"><Input placeholder="Method" value={ep.method} onChange={(e) => { const n = [...interfaceEndpoints]; n[i].method = e.target.value; setInterfaceEndpoints(n); }} /></div>
                                                <div className="col-span-8"><Input placeholder="Path" value={ep.path} onChange={(e) => { const n = [...interfaceEndpoints]; n[i].path = e.target.value; setInterfaceEndpoints(n); }} /></div>
                                                <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => setInterfaceEndpoints(interfaceEndpoints.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button></div>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => setInterfaceEndpoints([...interfaceEndpoints, { method: 'GET', path: '', request: '', response: '' }])}><Plus className="h-4 w-4 mr-2" /> Add Endpoint</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* QUALITY & CONFIG TAB */}
                            <TabsContent value="quality" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader><CardTitle>Quality Assurance</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Test Types</Label>
                                            <div className="flex gap-4">
                                                <div className="flex items-center space-x-2"><Checkbox checked={testTypes.includes('unit')} onCheckedChange={(c) => { if (c) setTestTypes([...testTypes, 'unit']); else setTestTypes(testTypes.filter(t => t !== 'unit')); }} /><Label>Unit</Label></div>
                                                <div className="flex items-center space-x-2"><Checkbox checked={testTypes.includes('integration')} onCheckedChange={(c) => { if (c) setTestTypes([...testTypes, 'integration']); else setTestTypes(testTypes.filter(t => t !== 'integration')); }} /><Label>Integration</Label></div>
                                                <div className="flex items-center space-x-2"><Checkbox checked={testTypes.includes('e2e')} onCheckedChange={(c) => { if (c) setTestTypes([...testTypes, 'e2e']); else setTestTypes(testTypes.filter(t => t !== 'e2e')); }} /><Label>E2E</Label></div>
                                                <div className="flex items-center space-x-2"><Checkbox checked={testTypes.includes('security')} onCheckedChange={(c) => { if (c) setTestTypes([...testTypes, 'security']); else setTestTypes(testTypes.filter(t => t !== 'security')); }} /><Label>Security</Label></div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Security Considerations</Label>
                                            {secConsiderations.map((s, i) => (<div key={i} className="flex gap-2"><Input value={s} onChange={(e) => { const n = [...secConsiderations]; n[i] = e.target.value; setSecConsiderations(n); }} /><Button type="button" variant="ghost" size="icon" onClick={() => setSecConsiderations(secConsiderations.filter((_, idx) => idx !== i))}><X className="h-4 w-4" /></Button></div>))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => setSecConsiderations([...secConsiderations, ''])}><Plus className="h-4 w-4 mr-2" /> Add Security Item</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 sticky bottom-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border rounded-lg">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={createMutation.isPending || !selectedProject}
                            >
                                {createMutation.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Create Use Case
                            </Button>
                        </div>
                    </form>
                </div>

                {/* RIGHT SIDE - AI Generation Panel (40% width) */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                AI Generation
                            </CardTitle>
                            <CardDescription>
                                Describe your use case and let AI generate the details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* AI Description Textarea */}
                            <div className="space-y-2">
                                <Label htmlFor="aiDescription">
                                    Describe Your Use Case
                                </Label>
                                <Textarea
                                    id="aiDescription"
                                    placeholder="e.g., I need a user authentication system where users can login with email and password, reset their password if forgotten, and manage their profile information..."
                                    value={aiDescription}
                                    onChange={(e) => setAiDescription(e.target.value)}
                                    rows={8}
                                    className="resize-none"
                                    disabled={isGenerating}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Provide a detailed description of what you want to build
                                </p>
                            </div>

                            {/* Error Display */}
                            {generationError && (
                                <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-destructive">{generationError}</p>
                                </div>
                            )}

                            {/* Generate Buttons */}
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="default"
                                    className="w-full"
                                    onClick={handleGenerateWithManualData}
                                    disabled={isGenerating || !aiDescription.trim()}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 mr-2" />
                                            Generate with Manual Data
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleGenerateWithDescriptionOnly}
                                    disabled={isGenerating || !aiDescription.trim()}
                                >
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate from Scratch
                                </Button>
                            </div>

                            {/* Status/Help Text */}
                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    <strong>💡 Tip:</strong> Use <strong>"Generate with Manual Data"</strong> to preserve your manual entries and only fill empty fields. Use <strong>"Generate from Scratch"</strong> to start fresh.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
