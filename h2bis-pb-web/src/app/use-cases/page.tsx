'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileText, Loader2, AlertCircle } from "lucide-react";
import { useUseCases } from "@/hooks/useUseCases";

export default function UseCasesPage() {
    const { data: useCases, isLoading, error } = useUseCases();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Use Cases</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and analyze project use cases
                    </p>
                </div>
                <Link href="/use-cases/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Use Case
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Use Case List</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Loading use cases...</span>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex flex-col items-center justify-center py-12 text-destructive">
                            <AlertCircle className="h-12 w-12 mb-4" />
                            <p className="font-semibold">Failed to load use cases</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {error.message || 'An unexpected error occurred'}
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && !error && (!useCases || useCases.length === 0) && (
                        <div className="text-center py-12 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No use cases found. Create your first use case to get started.</p>
                        </div>
                    )}

                    {/* Use Case List */}
                    {!isLoading && !error && useCases && useCases.length > 0 && (
                        <div className="space-y-3">
                            {useCases.map((useCase) => (
                                <Link
                                    key={useCase.key}
                                    href={`/use-cases/${useCase.key}`}
                                    className="block"
                                >
                                    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent hover:border-accent-foreground/20 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-lg">
                                                    {useCase.name}
                                                </h3>
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
                                                    <Badge variant="outline" className="text-xs">
                                                        AI Generated
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {useCase.description}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>Key: {useCase.key}</span>
                                                <span>Actor: {useCase.primaryActor}</span>
                                                {useCase.aiMetadata?.estimatedComplexity && (
                                                    <span className="capitalize">
                                                        Complexity: {useCase.aiMetadata.estimatedComplexity}
                                                    </span>
                                                )}
                                            </div>
                                            {useCase.tags && useCase.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {useCase.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
