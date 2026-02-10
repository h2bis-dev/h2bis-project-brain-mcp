'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, X } from 'lucide-react';
import {
    createProjectSchema,
    type CreateProjectInput,
    TECH_STACK_OPTIONS,
    LANGUAGE_OPTIONS,
    FRAMEWORK_OPTIONS
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (project: Project) => void;
}

export function CreateProjectModal({ open, onClose, onSuccess }: CreateProjectModalProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);

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
                techStack: [],
                language: undefined,
                framework: undefined,
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

    const addTechStack = (tech: string) => {
        if (!selectedTechStack.includes(tech)) {
            const newTechStack = [...selectedTechStack, tech];
            setSelectedTechStack(newTechStack);
            setValue('metadata.techStack', newTechStack);
        }
    };

    const removeTechStack = (tech: string) => {
        const newTechStack = selectedTechStack.filter(t => t !== tech);
        setSelectedTechStack(newTechStack);
        setValue('metadata.techStack', newTechStack);
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
            setSelectedTechStack([]);
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
            setSelectedTechStack([]);
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

                    {/* Language */}
                    <div className="space-y-2">
                        <Label htmlFor="language">Primary Language</Label>
                        <Select
                            onValueChange={(value) => setValue('metadata.language', value)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {LANGUAGE_OPTIONS.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Framework */}
                    <div className="space-y-2">
                        <Label htmlFor="framework">Framework</Label>
                        <Select
                            onValueChange={(value) => setValue('metadata.framework', value)}
                            disabled={isSubmitting}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                            <SelectContent>
                                {FRAMEWORK_OPTIONS.map((fw) => (
                                    <SelectItem key={fw} value={fw}>
                                        {fw}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <Label>Tech Stack</Label>
                        <Select onValueChange={addTechStack} disabled={isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Add technologies" />
                            </SelectTrigger>
                            <SelectContent>
                                {TECH_STACK_OPTIONS.filter(tech => !selectedTechStack.includes(tech)).map((tech) => (
                                    <SelectItem key={tech} value={tech}>
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-3 w-3" />
                                            {tech}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {selectedTechStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedTechStack.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="gap-1">
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTechStack(tech)}
                                            className="ml-1 hover:text-destructive"
                                            disabled={isSubmitting}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
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
