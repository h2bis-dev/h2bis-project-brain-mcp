'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Loader2, Sparkles, AlertCircle, Zap, Trash2, Wand2 } from 'lucide-react';
import { useUseCase, useUpdateUseCase, useEnhanceUseCase } from '@/hooks/useUseCases';
import { type UpdateUseCaseRequest } from '@/services/use-case.service';
import { generateUseCasePromptInstructions } from '@/lib/use-case-definitions';

type FieldOrigin = 'original' | 'ai' | 'user';

export default function EditUseCasePage() {
    const router = useRouter();
    const params = useParams();
    const useCaseId = params.id as string;

    const { data: useCase, isLoading, error: fetchError } = useUseCase(useCaseId);
    const updateMutation = useUpdateUseCase();
    const enhanceMutation = useEnhanceUseCase();

    // Track whether form has been populated from existing data
    const [isFormPopulated, setIsFormPopulated] = useState(false);

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

    // Domain Model
    const [domainEntities, setDomainEntities] = useState<Array<{
        name: string;
        description: string;
        fields: Array<{ name: string; type: string; required: boolean; constraints: string[] }>
    }>>([]);

    // Interfaces
    const [interfaceType, setInterfaceType] = useState<'REST' | 'GraphQL' | 'Event' | 'UI'>('REST');
    const [interfaceEndpoints, setInterfaceEndpoints] = useState<Array<{ method: string, path: string, request: string, response: string }>>([]);
    const [interfaceEvents, setInterfaceEvents] = useState<string[]>([]);

    // Architecture Patterns
    const [archPatterns, setArchPatterns] = useState<string[]>([]);

    // Config & Quality
    const [envVars, setEnvVars] = useState<string[]>([]);
    const [featureFlags, setFeatureFlags] = useState<string[]>([]);
    const [testTypes, setTestTypes] = useState<Array<'unit' | 'integration' | 'e2e' | 'security'>>(['unit']);
    const [perfCriteria, setPerfCriteria] = useState<string[]>([]);
    const [secConsiderations, setSecConsiderations] = useState<string[]>([]);

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
    const [lifecycle, setLifecycle] = useState('idea');

    // AI Enhancement state
    const [aiInstructions, setAiInstructions] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhanceError, setEnhanceError] = useState('');
    const [fieldOrigins, setFieldOrigins] = useState<Record<string, FieldOrigin>>({});

    // Populate form from existing use case data
    useEffect(() => {
        if (useCase && !isFormPopulated) {
            setKey(useCase.key || '');
            setName(useCase.name || '');
            setDescription(useCase.description || '');
            setBusinessValue(useCase.businessValue || '');
            setPrimaryActor(useCase.primaryActor || '');

            // Technical Surface
            if (useCase.technicalSurface) {
                const ts = useCase.technicalSurface;
                setBackendRepos(ts.backend?.repos?.length ? ts.backend.repos : ['']);
                setFrontendRepos(ts.frontend?.repos?.length ? ts.frontend.repos : ['']);
                setEndpoints(ts.backend?.endpoints?.length ? ts.backend.endpoints : ['']);
                setRoutes(ts.frontend?.routes?.length ? ts.frontend.routes : ['']);
                setComponents(ts.frontend?.components?.length ? ts.frontend.components : ['']);
            }

            setAcceptanceCriteria(useCase.acceptanceCriteria?.length ? useCase.acceptanceCriteria : ['']);
            setStakeholders(useCase.stakeholders || []);

            if (useCase.functionalRequirements) {
                setFunctionalReqs({
                    must: useCase.functionalRequirements.must?.length ? useCase.functionalRequirements.must : [''],
                    should: useCase.functionalRequirements.should?.length ? useCase.functionalRequirements.should : [''],
                    wont: useCase.functionalRequirements.wont?.length ? useCase.functionalRequirements.wont : [''],
                });
            }

            if (useCase.scope) {
                setScope({
                    inScope: useCase.scope.inScope?.length ? useCase.scope.inScope : [''],
                    outOfScope: useCase.scope.outOfScope?.length ? useCase.scope.outOfScope : [''],
                    assumptions: useCase.scope.assumptions?.length ? useCase.scope.assumptions : [''],
                    constraints: useCase.scope.constraints?.length ? useCase.scope.constraints : [''],
                });
            }

            if (useCase.domainModel?.entities) {
                setDomainEntities(useCase.domainModel.entities.map(e => ({
                    name: e.name,
                    description: e.description || '',
                    fields: e.fields || [],
                })));
            }

            if (useCase.interfaces) {
                if (useCase.interfaces.type) setInterfaceType(useCase.interfaces.type as any);
                if (useCase.interfaces.endpoints) {
                    setInterfaceEndpoints(useCase.interfaces.endpoints.map(ep => ({
                        method: ep.method,
                        path: ep.path,
                        request: ep.request || '',
                        response: ep.response || '',
                    })));
                }
                if (useCase.interfaces.events) setInterfaceEvents(useCase.interfaces.events);
            }

            if (useCase.architecturePatterns) setArchPatterns(useCase.architecturePatterns);

            if (useCase.configuration) {
                if (useCase.configuration.envVars) setEnvVars(useCase.configuration.envVars);
                if (useCase.configuration.featureFlags) setFeatureFlags(useCase.configuration.featureFlags);
            }

            if (useCase.quality) {
                if (useCase.quality.testTypes) setTestTypes(useCase.quality.testTypes as any);
                if (useCase.quality.performanceCriteria) setPerfCriteria(useCase.quality.performanceCriteria);
                if (useCase.quality.securityConsiderations) setSecConsiderations(useCase.quality.securityConsiderations);
            }

            setTags(useCase.tags || []);
            setComplexity((useCase.aiMetadata?.estimatedComplexity as any) || 'medium');
            setLifecycle(useCase.status?.lifecycle || 'idea');

            setIsFormPopulated(true);
        }
    }, [useCase, isFormPopulated]);

    // Field Origin Indicator Component - 3 states: original, ai, user
    const FieldOriginBadge = ({ field }: { field: string }) => {
        const origin = fieldOrigins[field];
        if (!origin) return null;

        const styles: Record<FieldOrigin, string> = {
            original: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
            ai: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
            user: 'bg-green-500/10 text-green-600 border-green-500/20',
        };

        const labels: Record<FieldOrigin, string> = {
            original: 'Original',
            ai: 'AI',
            user: 'You',
        };

        return (
            <Badge variant="secondary" className={`text-xs ${styles[origin]}`}>
                {origin === 'ai' ? '✨ ' : origin === 'user' ? '👤 ' : ''}{labels[origin]}
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

    // Track manual user input
    const handleUserInput = (field: string, setter: Function, value: any) => {
        setter(value);
        if (value && (typeof value === 'string' ? value.trim() : true)) {
            setFieldOrigins(prev => ({ ...prev, [field]: 'user' }));
        }
    };

    const updateFormWithEnhancedData = (enhanced: any) => {
        const update = (field: string, setter: Function, val: any) => {
            if (val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0)) {
                setter(val);
                setFieldOrigins(prev => ({ ...prev, [field]: 'ai' }));
            }
        };

        // Don't update key - it's immutable
        update('name', setName, enhanced.name);
        update('description', setDescription, enhanced.description);
        update('businessValue', setBusinessValue, enhanced.businessValue);
        update('primaryActor', setPrimaryActor, enhanced.primaryActor);

        if (enhanced.technicalSurface) {
            const ts = enhanced.technicalSurface;
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

        update('acceptanceCriteria', setAcceptanceCriteria, enhanced.acceptanceCriteria);
        update('stakeholders', setStakeholders, enhanced.stakeholders);

        if (enhanced.functionalRequirements) {
            update('functionalReqs', setFunctionalReqs, enhanced.functionalRequirements);
        }
        if (enhanced.scope) {
            update('scope', setScope, enhanced.scope);
        }
        if (enhanced.domainModel?.entities) {
            setDomainEntities(enhanced.domainModel.entities);
            setFieldOrigins(prev => ({ ...prev, 'domainEntities': 'ai' }));
        }
        if (enhanced.interfaces) {
            if (enhanced.interfaces.type) setInterfaceType(enhanced.interfaces.type);
            if (enhanced.interfaces.endpoints) setInterfaceEndpoints(enhanced.interfaces.endpoints);
            if (enhanced.interfaces.events) setInterfaceEvents(enhanced.interfaces.events);
        }
        if (enhanced.architecturePatterns) {
            setArchPatterns(enhanced.architecturePatterns);
        }
        if (enhanced.configuration) {
            if (enhanced.configuration.envVars) setEnvVars(enhanced.configuration.envVars);
            if (enhanced.configuration.featureFlags) setFeatureFlags(enhanced.configuration.featureFlags);
        }
        if (enhanced.quality) {
            if (enhanced.quality.testTypes) setTestTypes(enhanced.quality.testTypes);
            if (enhanced.quality.performanceCriteria) setPerfCriteria(enhanced.quality.performanceCriteria);
            if (enhanced.quality.securityConsiderations) setSecConsiderations(enhanced.quality.securityConsiderations);
        }

        if (enhanced.status?.lifecycle) setLifecycle(enhanced.status.lifecycle);
    };

    const handleEnhanceWithInstructions = async () => {
        if (!aiInstructions.trim()) {
            setEnhanceError('Please provide enhancement instructions');
            return;
        }

        setIsEnhancing(true);
        setEnhanceError('');

        try {
            const systemInstructions = generateUseCasePromptInstructions();
            const fullInstructions = `${aiInstructions}\n\n${systemInstructions}`;

            const response = await enhanceMutation.mutateAsync({
                useCaseId,
                instructions: fullInstructions,
            });

            updateFormWithEnhancedData(response.useCase);
            setEnhanceError('');
        } catch (error: any) {
            console.error('AI Enhancement failed:', error);
            setEnhanceError(error.message || 'Failed to enhance use case. Please try again.');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleEnhanceEmptyFields = async () => {
        setIsEnhancing(true);
        setEnhanceError('');

        try {
            // Detect empty fields
            const emptyFields: string[] = [];
            if (!description.trim()) emptyFields.push('description');
            if (!businessValue.trim()) emptyFields.push('businessValue');
            if (!primaryActor.trim()) emptyFields.push('primaryActor');
            if (acceptanceCriteria.every(ac => !ac.trim())) emptyFields.push('acceptanceCriteria');
            if (stakeholders.length === 0) emptyFields.push('stakeholders');
            if (functionalReqs.must.every(r => !r.trim())) emptyFields.push('functionalRequirements.must');
            if (scope.inScope.every(s => !s.trim())) emptyFields.push('scope.inScope');
            if (domainEntities.length === 0) emptyFields.push('domainModel.entities');
            if (secConsiderations.length === 0) emptyFields.push('quality.securityConsiderations');

            if (emptyFields.length === 0) {
                setEnhanceError('All fields are already filled. Use custom instructions to improve specific fields.');
                setIsEnhancing(false);
                return;
            }

            const systemInstructions = generateUseCasePromptInstructions();
            const instructions = `Fill in the empty/missing fields for this use case. Focus on: ${emptyFields.join(', ')}.\n\n${systemInstructions}`;

            const response = await enhanceMutation.mutateAsync({
                useCaseId,
                instructions,
                fieldsToEnhance: emptyFields,
            });

            updateFormWithEnhancedData(response.useCase);
            setEnhanceError('');
        } catch (error: any) {
            console.error('AI Enhancement failed:', error);
            setEnhanceError(error.message || 'Failed to enhance use case. Please try again.');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const request: UpdateUseCaseRequest = {
            name,
            description,
            businessValue,
            primaryActor,
            technicalSurface: {
                backend: {
                    repos: backendRepos.filter(r => r.trim()),
                    endpoints: endpoints.filter(e => e.trim()),
                },
                frontend: {
                    repos: frontendRepos.filter(r => r.trim()),
                    routes: routes.filter(r => r.trim()),
                    components: components.filter(c => c.trim()),
                }
            },
            acceptanceCriteria: acceptanceCriteria.filter(ac => ac.trim()),
            tags,
            aiMetadata: {
                estimatedComplexity: complexity
            },
            status: {
                lifecycle,
                reviewedByHuman: true,
                generatedByAI: useCase?.status?.generatedByAI || !!Object.values(fieldOrigins).find(o => o === 'ai')
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
            domainModel: {
                entities: domainEntities.map(e => ({
                    ...e,
                    fields: e.fields.filter(f => f.name.trim())
                })).filter(e => e.name.trim())
            },
            interfaces: {
                type: interfaceType,
                endpoints: interfaceEndpoints.filter(e => e.path.trim()),
                events: interfaceEvents.filter(e => e.trim())
            },
            architecturePatterns: archPatterns.filter(p => p.trim()),
            configuration: {
                envVars: envVars.filter(v => v.trim()),
                featureFlags: featureFlags.filter(f => f.trim())
            },
            quality: {
                testTypes,
                performanceCriteria: perfCriteria.filter(c => c.trim()),
                securityConsiderations: secConsiderations.filter(c => c.trim())
            }
        };

        updateMutation.mutate({ id: useCaseId, data: request });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading use case...</span>
            </div>
        );
    }

    // Error state
    if (fetchError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="border-destructive max-w-md">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                            <div>
                                <p className="font-medium text-destructive">Failed to load use case</p>
                                <p className="text-sm text-muted-foreground mt-1">{fetchError.message}</p>
                                <Button variant="outline" size="sm" className="mt-3" onClick={() => router.back()}>
                                    Go Back
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold tracking-tight">Edit Use Case</h1>
                    <p className="text-muted-foreground mt-1">
                        Update <strong>{useCase?.name}</strong> or enhance with AI
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {updateMutation.isError && (
                <Card className="border-destructive max-w-7xl">
                    <CardContent className="pt-6">
                        <p className="text-destructive text-sm">
                            {updateMutation.error.message || 'Failed to update use case'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Split Container: Form (Left) + AI Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl">
                {/* LEFT SIDE - Form (60% width) */}
                <div className="lg:col-span-2 space-y-6">
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
                                                    <Label htmlFor="key">Key</Label>
                                                    <Badge variant="outline" className="text-xs">Read-only</Badge>
                                                </div>
                                                <Input id="key" value={key} disabled className="bg-muted" />
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
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                                <FieldOriginBadge field="description" />
                                            </div>
                                            <Textarea id="description" placeholder="Describe what this use case does..." value={description} onChange={(e) => handleUserInput('description', setDescription, e.target.value)} rows={3} required />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="businessValue">Business Value <span className="text-destructive">*</span></Label>
                                                <FieldOriginBadge field="businessValue" />
                                            </div>
                                            <Textarea id="businessValue" placeholder="Explain the business value..." value={businessValue} onChange={(e) => handleUserInput('businessValue', setBusinessValue, e.target.value)} rows={2} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="primaryActor">Primary Actor <span className="text-destructive">*</span></Label>
                                                    <FieldOriginBadge field="primaryActor" />
                                                </div>
                                                <Input id="primaryActor" placeholder="e.g., End User" value={primaryActor} onChange={(e) => handleUserInput('primaryActor', setPrimaryActor, e.target.value)} required />
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
                                <Card>
                                    <CardHeader><CardTitle>Domain Model</CardTitle><CardDescription>Define entities and their fields</CardDescription></CardHeader>
                                    <CardContent className="space-y-4">
                                        <Accordion type="multiple" className="w-full">
                                            {domainEntities.map((entity, i) => (
                                                <AccordionItem key={i} value={`entity-${i}`}>
                                                    <div className="flex items-center gap-2 py-4">
                                                        <Input
                                                            className="max-w-[200px]"
                                                            value={entity.name}
                                                            onChange={(e) => { const n = [...domainEntities]; n[i].name = e.target.value; setDomainEntities(n); }}
                                                            placeholder="Entity Name"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => { setDomainEntities(domainEntities.filter((_, idx) => idx !== i)); }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                        <AccordionTrigger className="py-0 flex-none ml-auto">
                                                            <span className="sr-only">Toggle</span>
                                                        </AccordionTrigger>
                                                    </div>
                                                    <AccordionContent className="px-4 py-2 space-y-3">
                                                        <Input placeholder="Description" value={entity.description} onChange={(e) => { const n = [...domainEntities]; n[i].description = e.target.value; setDomainEntities(n); }} />
                                                        <Label>Fields</Label>
                                                        {entity.fields.map((field, fi) => (
                                                            <div key={fi} className="grid grid-cols-12 gap-2">
                                                                <div className="col-span-4"><Input placeholder="Name" value={field.name} onChange={(e) => { const n = [...domainEntities]; n[i].fields[fi].name = e.target.value; setDomainEntities(n); }} /></div>
                                                                <div className="col-span-3"><Input placeholder="Type" value={field.type} onChange={(e) => { const n = [...domainEntities]; n[i].fields[fi].type = e.target.value; setDomainEntities(n); }} /></div>
                                                                <div className="col-span-1 flex items-center"><Checkbox checked={field.required} onCheckedChange={(c) => { const n = [...domainEntities]; n[i].fields[fi].required = !!c; setDomainEntities(n); }} /> <span className="ml-1 text-xs">Req</span></div>
                                                                <div className="col-span-3"><Input placeholder="Constraint" value={field.constraints[0] || ''} onChange={(e) => { const n = [...domainEntities]; n[i].fields[fi].constraints[0] = e.target.value; setDomainEntities(n); }} /></div>
                                                                <div className="col-span-1"><Button type="button" variant="ghost" size="icon" onClick={() => { const n = [...domainEntities]; n[i].fields = n[i].fields.filter((_, fidx) => fidx !== fi); setDomainEntities(n); }}><X className="h-3 w-3" /></Button></div>
                                                            </div>
                                                        ))}
                                                        <Button type="button" variant="outline" size="sm" onClick={() => { const n = [...domainEntities]; n[i].fields.push({ name: '', type: 'string', required: false, constraints: [] }); setDomainEntities(n); }}><Plus className="h-3 w-3 mr-1" /> Add Field</Button>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                        <Button type="button" variant="outline" onClick={() => setDomainEntities([...domainEntities, { name: '', description: '', fields: [] }])}><Plus className="h-4 w-4 mr-2" /> Add Entity</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* TECHNICAL TAB */}
                            <TabsContent value="technical" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader><CardTitle>Technical Surface</CardTitle></CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-3">
                                            <Label>Backend Repos</Label>
                                            {backendRepos.map((repo, i) => (<div key={i} className="flex gap-2"><Input value={repo} onChange={(e) => handleUpdateItem(i, e.target.value, backendRepos, setBackendRepos)} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(i, backendRepos, setBackendRepos)}><X className="h-4 w-4" /></Button></div>))}
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleAddItem(backendRepos, setBackendRepos)}><Plus className="h-4 w-4 mr-2" /> Add Repo</Button>
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Frontend Repos</Label>
                                            {frontendRepos.map((repo, i) => (<div key={i} className="flex gap-2"><Input value={repo} onChange={(e) => handleUpdateItem(i, e.target.value, frontendRepos, setFrontendRepos)} /><Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(i, frontendRepos, setFrontendRepos)}><X className="h-4 w-4" /></Button></div>))}
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
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Architecture Patterns</CardTitle>
                                        <CardDescription>Use case-specific design patterns</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {archPatterns.map((pattern, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    placeholder="e.g., Repository, Factory, Strategy"
                                                    value={pattern}
                                                    onChange={(e) => { const n = [...archPatterns]; n[i] = e.target.value; setArchPatterns(n); }}
                                                />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => setArchPatterns(archPatterns.filter((_, idx) => idx !== i))}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={() => setArchPatterns([...archPatterns, ''])}>
                                            <Plus className="h-4 w-4 mr-2" /> Add Pattern
                                        </Button>
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
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                Update Use Case
                            </Button>
                        </div>
                    </form>
                </div>

                {/* RIGHT SIDE - AI Enhancement Panel (40% width) */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5 text-primary" />
                                AI Enhancement
                            </CardTitle>
                            <CardDescription>
                                Improve or fill empty fields using AI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* AI Instructions Textarea */}
                            <div className="space-y-2">
                                <Label htmlFor="aiInstructions">
                                    Enhancement Instructions
                                </Label>
                                <Textarea
                                    id="aiInstructions"
                                    placeholder="e.g., Add more detailed acceptance criteria, improve the security considerations, fill in missing domain entities..."
                                    value={aiInstructions}
                                    onChange={(e) => setAiInstructions(e.target.value)}
                                    rows={6}
                                    className="resize-none"
                                    disabled={isEnhancing}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Tell the AI what to improve or add
                                </p>
                            </div>

                            {/* Error Display */}
                            {enhanceError && (
                                <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-destructive">{enhanceError}</p>
                                </div>
                            )}

                            {/* Enhance Buttons */}
                            <div className="space-y-2">
                                <Button
                                    type="button"
                                    variant="default"
                                    className="w-full"
                                    onClick={handleEnhanceWithInstructions}
                                    disabled={isEnhancing || !aiInstructions.trim()}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Enhancing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Enhance with AI
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={handleEnhanceEmptyFields}
                                    disabled={isEnhancing}
                                >
                                    {isEnhancing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Detecting & Filling...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="h-4 w-4 mr-2" />
                                            Fill Empty Fields
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Status/Help Text */}
                            <div className="pt-4 border-t">
                                <p className="text-xs text-muted-foreground">
                                    <strong>Tip:</strong> Use <strong>"Enhance with AI"</strong> with custom instructions to improve specific areas. Use <strong>"Fill Empty Fields"</strong> to auto-detect and fill missing data.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge variant="secondary" className="text-xs bg-gray-500/10 text-gray-600">Original</Badge>
                                    <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">AI Enhanced</Badge>
                                    <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">Your Edits</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
