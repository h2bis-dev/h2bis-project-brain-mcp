'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
    createProjectSchema,
    type CreateProjectInput,
} from '@/lib/validations/project.validation';
import { PROJECT_METADATA_CONSTANTS } from '@/constants/project-metadata.constants';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/project.types';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (project: Project) => void;
}

export function CreateProjectModal({ open, onClose, onSuccess }: CreateProjectModalProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            _id: '',
            name: '',
            lifecycle: 'planning',
            description: undefined,
            metadata: {
                repository: '',
            },
        },
    });

    const generateProjectId = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const generatedId = generateProjectId(name);
        setValue('_id', generatedId);
    };

    const onSubmit = async (data: CreateProjectInput) => {
        try {
            setIsSubmitting(true);

            const newProject = await projectService.create(data);

            toast({
                title: 'Success!',
                description: `Project "${data.name}" created successfully.`,
            });

            reset();
            onSuccess(newProject);
            onClose();
        } catch (error) {
            console.error('Error creating project:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create project',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Add a new software development project to track use cases, capabilities, and progress.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Project Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Project Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="My Awesome Project"
                            {...register('name')}
                            onChange={(e) => {
                                register('name').onChange(e);
                                handleNameChange(e);
                            }}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Project ID (auto-generated) */}
                    <div className="space-y-2">
                        <Label htmlFor="_id">
                            Project ID <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="_id"
                            placeholder="my-awesome-project"
                            {...register('_id')}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted-foreground">
                            Auto-generated from project name. Use lowercase, numbers, and hyphens only.
                        </p>
                        {errors._id && (
                            <p className="text-sm text-red-500">{errors._id.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of your project..."
                            rows={3}
                            {...register('description')}
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Lifecycle Status */}
                    <div className="space-y-2">
                        <Label htmlFor="lifecycle">Lifecycle Status</Label>
                        <Select
                            defaultValue="planning"
                            onValueChange={(value) => setValue('lifecycle', value as CreateProjectInput['lifecycle'])}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select lifecycle status" />
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
                            Current development stage of the project
                        </p>
                    </div>

                    {/* Repository URL */}
                    <div className="space-y-2">
                        <Label htmlFor="repository">Repository URL (optional)</Label>
                        <Input
                            id="repository"
                            type="url"
                            placeholder="https://github.com/username/repo"
                            {...register('metadata.repository')}
                            disabled={isSubmitting}
                        />
                        {errors.metadata?.repository && (
                            <p className="text-sm text-red-500">{errors.metadata.repository.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
