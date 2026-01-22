'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { useCreateUseCase } from '@/hooks/useUseCases';
import type { CreateUseCaseRequest } from '@/services/use-case.service';

export default function NewUseCasePage() {
    const router = useRouter();
    const createMutation = useCreateUseCase();

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
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Build request
        const request: CreateUseCaseRequest = {
            key: key.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
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
            }
        };

        createMutation.mutate(request);
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
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
                        Define a new use case for your project
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {createMutation.isError && (
                <Card className="border-destructive">
                    <CardContent className="pt-6">
                        <p className="text-destructive text-sm">
                            {createMutation.error.message || 'Failed to create use case'}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            Essential details about the use case
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="key">
                                    Key <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="key"
                                    placeholder="e.g., uc-user-login"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Unique identifier (lowercase, hyphens allowed)
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., User Login"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what this use case does..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="businessValue">
                                Business Value <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="businessValue"
                                placeholder="Explain the business value..."
                                value={businessValue}
                                onChange={(e) => setBusinessValue(e.target.value)}
                                rows={2}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="primaryActor">
                                Primary Actor <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="primaryActor"
                                placeholder="e.g., End User, Administrator"
                                value={primaryActor}
                                onChange={(e) => setPrimaryActor(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="complexity">Complexity</Label>
                            <select
                                id="complexity"
                                value={complexity}
                                onChange={(e) => setComplexity(e.target.value as any)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Technical Surface */}
                <Card>
                    <CardHeader>
                        <CardTitle>Technical Surface</CardTitle>
                        <CardDescription>
                            Specify the technical implementation details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Backend */}
                        <div className="space-y-3">
                            <Label>Backend Repositories <span className="text-destructive">*</span></Label>
                            {backendRepos.map((repo, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., api, backend-service"
                                        value={repo}
                                        onChange={(e) => handleUpdateItem(index, e.target.value, backendRepos, setBackendRepos)}
                                        required={index === 0}
                                    />
                                    {backendRepos.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index, backendRepos, setBackendRepos)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(backendRepos, setBackendRepos)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Repository
                            </Button>
                        </div>

                        {/* Backend Endpoints */}
                        <div className="space-y-3">
                            <Label>API Endpoints</Label>
                            {endpoints.map((endpoint, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., /api/auth/login"
                                        value={endpoint}
                                        onChange={(e) => handleUpdateItem(index, e.target.value, endpoints, setEndpoints)}
                                    />
                                    {endpoints.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index, endpoints, setEndpoints)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(endpoints, setEndpoints)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Endpoint
                            </Button>
                        </div>

                        {/* Frontend */}
                        <div className="space-y-3">
                            <Label>Frontend Repositories <span className="text-destructive">*</span></Label>
                            {frontendRepos.map((repo, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., web, mobile-app"
                                        value={repo}
                                        onChange={(e) => handleUpdateItem(index, e.target.value, frontendRepos, setFrontendRepos)}
                                        required={index === 0}
                                    />
                                    {frontendRepos.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index, frontendRepos, setFrontendRepos)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(frontendRepos, setFrontendRepos)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Repository
                            </Button>
                        </div>

                        {/* Frontend Routes */}
                        <div className="space-y-3">
                            <Label>Routes</Label>
                            {routes.map((route, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., /login, /dashboard"
                                        value={route}
                                        onChange={(e) => handleUpdateItem(index, e.target.value, routes, setRoutes)}
                                    />
                                    {routes.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index, routes, setRoutes)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(routes, setRoutes)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Route
                            </Button>
                        </div>

                        {/* Components */}
                        <div className="space-y-3">
                            <Label>Components</Label>
                            {components.map((component, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="e.g., LoginForm, UserProfile"
                                        value={component}
                                        onChange={(e) => handleUpdateItem(index, e.target.value, components, setComponents)}
                                    />
                                    {components.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveItem(index, components, setComponents)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddItem(components, setComponents)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Component
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Acceptance Criteria */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acceptance Criteria</CardTitle>
                        <CardDescription>
                            Define the conditions that must be met
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {acceptanceCriteria.map((criteria, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    placeholder="e.g., User can log in with email and password"
                                    value={criteria}
                                    onChange={(e) => handleUpdateItem(index, e.target.value, acceptanceCriteria, setAcceptanceCriteria)}
                                />
                                {acceptanceCriteria.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveItem(index, acceptanceCriteria, setAcceptanceCriteria)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(acceptanceCriteria, setAcceptanceCriteria)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Criterion
                        </Button>
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>
                            Add tags to categorize this use case
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2">
                            <Input
                                placeholder="e.g., authentication, user-management"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddTag}
                            >
                                Add
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        Create Use Case
                    </Button>
                </div>
            </form>
        </div>
    );
}
