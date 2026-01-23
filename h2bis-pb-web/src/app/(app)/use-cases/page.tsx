'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { Plus, FileText, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useUseCases, useDeleteUseCase } from "@/hooks/useUseCases";
import { ROUTES } from "@/lib/constants";
import { UseCaseDetail } from "@/components/use-cases/UseCaseDetail";
import { cn } from "@/lib/utils";

export default function UseCasesPage() {
    const { data: session } = useSession();
    const { data: useCases, isLoading, error } = useUseCases();
    const deleteMutation = useDeleteUseCase();

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [useCaseToDelete, setUseCaseToDelete] = useState<{ id: string; name: string } | null>(null);
    const [selectedUseCaseId, setSelectedUseCaseId] = useState<string | null>(null);
    const [isDetailExpanded, setIsDetailExpanded] = useState(false);

    // Check if user has delete permission (admin or moderator)
    const canDelete = session?.user?.permissions?.includes('delete:use-case') || false;

    const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();
        setUseCaseToDelete({ id, name });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (useCaseToDelete) {
            deleteMutation.mutate(useCaseToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setUseCaseToDelete(null);
                },
            });
        }
    };

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
                <Link href={ROUTES.USE_CASE_NEW}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Use Case
                    </Button>
                </Link>
            </div>

            {/* Split Pane Content */}
            <div className={cn(
                "grid gap-4",
                selectedUseCaseId && !isDetailExpanded
                    ? "grid-cols-1 lg:grid-cols-2"  // Split view
                    : "grid-cols-1"  // Full list or full detail
            )}>
                {/* Use Cases List - Hide when detail is expanded */}
                {!(selectedUseCaseId && isDetailExpanded) && (
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
                                        <div
                                            key={useCase.key}
                                            className={cn(
                                                "flex items-start justify-between p-4 border rounded-lg hover:bg-accent hover:border-accent-foreground/20 transition-colors cursor-pointer",
                                                selectedUseCaseId === useCase.key && "bg-accent border-accent-foreground/30"
                                            )}
                                            onClick={() => setSelectedUseCaseId(useCase.key)}
                                        >
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

                                            {/* Delete Button (Admin/Moderator Only) */}
                                            {canDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={(e) => handleDeleteClick(e, useCase.key, useCase.name)}
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Use Case Detail - Show when selected */}
                {selectedUseCaseId && (
                    <UseCaseDetail
                        useCaseId={selectedUseCaseId}
                        onClose={() => {
                            setSelectedUseCaseId(null);
                            setIsDetailExpanded(false);
                        }}
                        isExpanded={isDetailExpanded}
                        onToggleExpand={() => setIsDetailExpanded(!isDetailExpanded)}
                    />
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the use case "{useCaseToDelete?.name}".
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleteMutation.isPending}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {deleteMutation.isPending && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
