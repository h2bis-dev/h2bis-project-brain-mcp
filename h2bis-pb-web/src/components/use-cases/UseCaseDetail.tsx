"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Maximize2, Minimize2, Loader2, AlertCircle } from "lucide-react";
import { useUseCase } from "@/hooks/useUseCases";
import { cn } from "@/lib/utils";
import type { UseCase } from "@/types/use-case.types";

interface UseCaseDetailProps {
    useCaseId: string;
    onClose: () => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export function UseCaseDetail({ useCaseId, onClose, isExpanded, onToggleExpand }: UseCaseDetailProps) {
    const { data: useCase, isLoading, error } = useUseCase(useCaseId);

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
                        variant="ghost"
                        size="icon"
                        onClick={onToggleExpand}
                        title={isExpanded ? "Show split view" : "Expand to full width"}
                    >
                        {isExpanded ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
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

            {/* Scrollable content */}
            <CardContent className="flex-1 overflow-y-auto space-y-6">
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
                </div>

                {/* Business Value */}
                <div>
                    <h3 className="font-semibold text-sm mb-2">Business Value</h3>
                    <p className="text-sm text-muted-foreground">{useCase.businessValue}</p>
                </div>

                {/* Acceptance Criteria */}
                {useCase.acceptanceCriteria && useCase.acceptanceCriteria.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Acceptance Criteria</h3>
                        <ul className="list-disc list-inside space-y-1">
                            {useCase.acceptanceCriteria.map((criterion, index) => (
                                <li key={index} className="text-sm text-muted-foreground">{criterion}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Flows */}
                {useCase.flows && useCase.flows.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Flows</h3>
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
                    </div>
                )}

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

                {/* AI Metadata */}
                {useCase.aiMetadata && (
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p className="capitalize">Complexity: {useCase.aiMetadata.estimatedComplexity}</p>
                        {useCase.aiMetadata.suggestedOrder && (
                            <p>Suggested Order: {useCase.aiMetadata.suggestedOrder}</p>
                        )}
                        {useCase.aiMetadata.testStrategy && useCase.aiMetadata.testStrategy.length > 0 && (
                            <p>Test Strategy: {useCase.aiMetadata.testStrategy.join(', ')}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
