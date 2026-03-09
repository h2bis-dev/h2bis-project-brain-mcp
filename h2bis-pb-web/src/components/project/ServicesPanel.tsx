"use client";

import React, { useState } from "react";
import {
    Globe, Smartphone, Server, Cpu, Database, Package,
    Plus, Pencil, Trash2, X, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TagInput } from "@/components/ui/tag-input";
import type { ProjectService, ProjectServiceType } from "@/types/project.types";
import { PROJECT_METADATA_CONSTANTS } from "@/constants/project-metadata.constants";

// ─── Constants ────────────────────────────────────────────────────────────────

export const SERVICE_TYPE_CONFIG: Record<
    ProjectServiceType,
    { label: string; Icon: React.ElementType; color: string; badgeClass: string }
> = {
    "web-app":            { label: "Web App",           Icon: Globe,       color: "text-blue-500",   badgeClass: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300" },
    "mobile-app":         { label: "Mobile App",        Icon: Smartphone,  color: "text-purple-500", badgeClass: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300" },
    "api":                { label: "API Service",       Icon: Server,      color: "text-green-500",  badgeClass: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300" },
    "background-service": { label: "Background Service",Icon: Cpu,         color: "text-orange-500", badgeClass: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300" },
    "data-service":       { label: "Data Service",      Icon: Database,    color: "text-amber-500",  badgeClass: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300" },
    "other":              { label: "Other",             Icon: Package,     color: "text-slate-500",  badgeClass: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300" },
};

const EMPTY_SERVICE: Omit<ProjectService, "id"> = {
    name:        "",
    type:        "api",
    language:    "",
    framework:   "",
    techStack:   [],
    description: "",
    goals:       "",
    repository:  "",
};

function randomId() {
    return Math.random().toString(36).slice(2, 10);
}

// ─── ServiceFormDialog ────────────────────────────────────────────────────────

interface ServiceFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (service: ProjectService) => void;
    initial?: ProjectService | null;
}

function ServiceFormDialog({ open, onClose, onSave, initial }: ServiceFormDialogProps) {
    const [form, setForm] = useState<Omit<ProjectService, "id">>(() => {
        if (initial) {
            const { id, ...rest } = initial;
            return rest;
        }
        return { ...EMPTY_SERVICE };
    });

    // Reset form when dialog opens with new initial value
    React.useEffect(() => {
        if (open) {
            if (initial) {
                const { id, ...rest } = initial;
                setForm(rest);
            } else {
                setForm({ ...EMPTY_SERVICE });
            }
        }
    }, [open, initial]);

    const update = (key: keyof Omit<ProjectService, "id">, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!form.name.trim() || !form.type) return;
        onSave({ id: initial?.id ?? randomId(), ...form });
        onClose();
    };

    const isValid = form.name.trim().length > 0;

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {initial ? `Edit "${initial.name}"` : "Add Application or Service"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="svc-name">
                            Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="svc-name"
                            placeholder="e.g. Customer Web App, Data Analytics Service"
                            value={form.name}
                            onChange={(e) => update("name", e.target.value)}
                        />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label>
                            Service Type <span className="text-destructive">*</span>
                        </Label>
                        <Select value={form.type} onValueChange={(v) => update("type", v as ProjectServiceType)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {(Object.entries(SERVICE_TYPE_CONFIG) as [ProjectServiceType, typeof SERVICE_TYPE_CONFIG[ProjectServiceType]][]).map(([key, cfg]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <cfg.Icon className={`h-4 w-4 ${cfg.color}`} />
                                            {cfg.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Language */}
                    <div className="space-y-2">
                        <Label>Language</Label>
                        <Select
                            value={form.language || ""}
                            onValueChange={(v) => update("language", v === "__none__" ? "" : v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">— None —</SelectItem>
                                {PROJECT_METADATA_CONSTANTS.languages.map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Framework */}
                    <div className="space-y-2">
                        <Label>Framework</Label>
                        <Select
                            value={form.framework || ""}
                            onValueChange={(v) => update("framework", v === "__none__" ? "" : v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">— None —</SelectItem>
                                {PROJECT_METADATA_CONSTANTS.frameworks.map((f) => (
                                    <SelectItem key={f} value={f}>{f}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tech Stack */}
                    <div className="space-y-2">
                        <Label>Additional Technologies</Label>
                        <TagInput
                            value={form.techStack || []}
                            onChange={(v) => update("techStack", v)}
                            suggestions={PROJECT_METADATA_CONSTANTS.techStack}
                            placeholder="Add libraries, databases, tools..."
                        />
                    </div>

                    <Separator />

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="svc-desc">Description</Label>
                        <Textarea
                            id="svc-desc"
                            rows={3}
                            placeholder="What does this service/app do?"
                            value={form.description || ""}
                            onChange={(e) => update("description", e.target.value)}
                        />
                    </div>

                    {/* Goals */}
                    <div className="space-y-2">
                        <Label htmlFor="svc-goals">Goals & Expected Outcomes</Label>
                        <Textarea
                            id="svc-goals"
                            rows={3}
                            placeholder="Key objectives, deliverables, or success criteria..."
                            value={form.goals || ""}
                            onChange={(e) => update("goals", e.target.value)}
                        />
                    </div>

                    {/* Repository */}
                    <div className="space-y-2">
                        <Label htmlFor="svc-repo">Repository URL</Label>
                        <Input
                            id="svc-repo"
                            type="url"
                            placeholder="https://github.com/org/service-repo"
                            value={form.repository || ""}
                            onChange={(e) => update("repository", e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!isValid}>
                        <Check className="mr-2 h-4 w-4" />
                        {initial ? "Save Changes" : "Add Service"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── ServiceCard ──────────────────────────────────────────────────────────────

interface ServiceCardProps {
    service: ProjectService;
    onEdit: () => void;
    onDelete: () => void;
}

function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
    const cfg = SERVICE_TYPE_CONFIG[service.type] ?? SERVICE_TYPE_CONFIG.other;
    const Icon = cfg.Icon;

    return (
        <Card className="relative group transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`h-5 w-5 flex-shrink-0 ${cfg.color}`} />
                        <CardTitle className="text-base leading-tight truncate">{service.name}</CardTitle>
                    </div>
                    {/* action buttons — visible on hover */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onEdit}>
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={onDelete}>
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
                <Badge variant="outline" className={`w-fit text-xs ${cfg.badgeClass}`}>
                    {cfg.label}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-2 pt-0">
                {/* Tech info row */}
                {(service.language || service.framework) && (
                    <div className="flex flex-wrap gap-1">
                        {service.language && (
                            <Badge variant="secondary" className="text-xs">{service.language}</Badge>
                        )}
                        {service.framework && (
                            <Badge variant="secondary" className="text-xs">{service.framework}</Badge>
                        )}
                    </div>
                )}

                {/* Additional tech stack */}
                {service.techStack && service.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {service.techStack.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs font-normal">{t}</Badge>
                        ))}
                    </div>
                )}

                {/* Description */}
                {service.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                )}

                {/* Goals */}
                {service.goals && (
                    <div className="pt-1 border-t">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Goals</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.goals}</p>
                    </div>
                )}

                {/* Repository link */}
                {service.repository && (
                    <a
                        href={service.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 pt-1 truncate"
                    >
                        {service.repository}
                    </a>
                )}
            </CardContent>
        </Card>
    );
}

// ─── ServicesPanel (exported) ─────────────────────────────────────────────────

interface ServicesPanelProps {
    services: ProjectService[];
    onChange: (services: ProjectService[]) => void;
}

export function ServicesPanel({ services, onChange }: ServicesPanelProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ProjectService | null>(null);

    const openAdd = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (svc: ProjectService) => {
        setEditing(svc);
        setDialogOpen(true);
    };

    const handleSave = (saved: ProjectService) => {
        if (editing) {
            onChange(services.map((s) => (s.id === saved.id ? saved : s)));
        } else {
            onChange([...services, saved]);
        }
    };

    const handleDelete = (id: string) => {
        onChange(services.filter((s) => s.id !== id));
    };

    return (
        <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold">Applications &amp; Services</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Define each application, API, or service that makes up this project
                    </p>
                </div>
                <Button size="sm" onClick={openAdd} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Add Service
                </Button>
            </div>

            {/* Cards grid or empty state */}
            {services.length === 0 ? (
                <div
                    onClick={openAdd}
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Plus className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium">No services added yet</p>
                        <p className="text-xs">
                            Click to add your first application or service — e.g. a Web App, Mobile App, API, or Data Service
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {services.map((svc) => (
                        <ServiceCard
                            key={svc.id}
                            service={svc}
                            onEdit={() => openEdit(svc)}
                            onDelete={() => handleDelete(svc.id)}
                        />
                    ))}
                    {/* Quick-add tile */}
                    <button
                        type="button"
                        onClick={openAdd}
                        className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:bg-muted/30 transition-colors min-h-[120px]"
                    >
                        <Plus className="h-5 w-5 opacity-50" />
                        <span className="text-xs font-medium">Add another</span>
                    </button>
                </div>
            )}

            <ServiceFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSave}
                initial={editing}
            />
        </div>
    );
}
