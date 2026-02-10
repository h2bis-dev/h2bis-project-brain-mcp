"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/components/ui/tag-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROJECT_METADATA_CONSTANTS } from "@/constants/project-metadata.constants";
import { Plus, X } from "lucide-react";

export interface ProjectMetadata {
    repository: string;
    techStack: string[];
    language: string;
    framework: string;
    architecture: {
        overview: string[];
        style: string[];
        directoryStructure: string;
        stateManagement: string[];
    };
    authStrategy: {
        approach: string[];
        implementation: string;
    };
    deployment: {
        environment: string[];
        cicd: string[];
    };
    externalServices: Array<{
        name: string;
        purpose: string;
        apiDocs: string;
    }>;
    standards: {
        codingStyle: {
            guide: string;
            linter: string[];
        };
        namingConventions: string;
        errorHandling: string[];
        loggingConvention: string[];
    };
    qualityGates: {
        definitionOfDone: string[];
        codeReviewChecklist: string[];
        testingRequirements: {
            coverage: number;
            testTypes: string[];
            requiresE2ETests: boolean;
        };
        documentationStandards: string;
    };
}

export interface ProjectMetadataFormProps {
    value: ProjectMetadata;
    onChange: (metadata: ProjectMetadata) => void;
    className?: string;
}

const defaultMetadata: ProjectMetadata = {
    repository: "",
    techStack: [],
    language: "",
    framework: "",
    architecture: {
        overview: [],
        style: [],
        directoryStructure: "",
        stateManagement: [],
    },
    authStrategy: {
        approach: [],
        implementation: "",
    },
    deployment: {
        environment: [],
        cicd: [],
    },
    externalServices: [],
    standards: {
        codingStyle: {
            guide: "",
            linter: [],
        },
        namingConventions: "",
        errorHandling: [],
        loggingConvention: [],
    },
    qualityGates: {
        definitionOfDone: [],
        codeReviewChecklist: [],
        testingRequirements: {
            coverage: 0,
            testTypes: [],
            requiresE2ETests: false,
        },
        documentationStandards: "",
    },
};

/**
 * ProjectMetadataForm Component
 * Comprehensive form for editing project metadata with tag inputs and organized sections
 */
export function ProjectMetadataForm({ value = defaultMetadata, onChange, className }: ProjectMetadataFormProps) {
    const updateMetadata = (path: string, newValue: any) => {
        const pathParts = path.split(".");
        const updated = { ...value };
        let current: any = updated;

        for (let i = 0; i < pathParts.length - 1; i++) {
            current[pathParts[i]] = { ...current[pathParts[i]] };
            current = current[pathParts[i]];
        }

        current[pathParts[pathParts.length - 1]] = newValue;
        onChange(updated);
    };

    const addExternalService = () => {
        onChange({
            ...value,
            externalServices: [...value.externalServices, { name: "", purpose: "", apiDocs: "" }],
        });
    };

    const removeExternalService = (index: number) => {
        onChange({
            ...value,
            externalServices: value.externalServices.filter((_, i) => i !== index),
        });
    };

    const updateExternalService = (index: number, field: string, fieldValue: string) => {
        const updated = [...value.externalServices];
        updated[index] = { ...updated[index], [field]: fieldValue };
        onChange({ ...value, externalServices: updated });
    };

    const addArrayItem = (path: string) => {
        const current = path.split(".").reduce((obj, key) => obj[key], value as any);
        updateMetadata(path, [...(current || []), ""]);
    };

    const updateArrayItem = (path: string, index: number, itemValue: string) => {
        const current = path.split(".").reduce((obj, key) => obj[key], value as any);
        const updated = [...current];
        updated[index] = itemValue;
        updateMetadata(path, updated);
    };

    const removeArrayItem = (path: string, index: number) => {
        const current = path.split(".").reduce((obj, key) => obj[key], value as any);
        updateMetadata(path, current.filter((_: any, i: number) => i !== index));
    };

    return (
        <div className={className}>
            {/* System Context */}
            <Card>
                <CardHeader>
                    <CardTitle>System Context</CardTitle>
                    <CardDescription>Basic information about your project's technology and structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="repository">Repository URL</Label>
                        <Input
                            id="repository"
                            placeholder="https://github.com/username/project"
                            value={value.repository}
                            onChange={(e) => updateMetadata("repository", e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">Primary Language</Label>
                            <Select value={value.language} onValueChange={(val) => updateMetadata("language", val)}>
                                <SelectTrigger id="language">
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROJECT_METADATA_CONSTANTS.languages.map((lang) => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="framework">Primary Framework</Label>
                            <Select value={value.framework} onValueChange={(val) => updateMetadata("framework", val)}>
                                <SelectTrigger id="framework">
                                    <SelectValue placeholder="Select framework" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROJECT_METADATA_CONSTANTS.frameworks.map((fw) => (
                                        <SelectItem key={fw} value={fw}>
                                            {fw}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Tech Stack</Label>
                        <TagInput
                            value={value.techStack}
                            onChange={(tags) => updateMetadata("techStack", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.techStack}
                            placeholder="Add technologies (e.g., React, Node.js, MongoDB)..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Architecture */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Architecture</CardTitle>
                    <CardDescription>Describe your project's architectural patterns and structure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Architecture Overview</Label>
                        <TagInput
                            value={value.architecture.overview}
                            onChange={(tags) => updateMetadata("architecture.overview", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.architectureOverview}
                            placeholder="e.g., Monolithic, Microservices..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Architecture Style</Label>
                        <TagInput
                            value={value.architecture.style}
                            onChange={(tags) => updateMetadata("architecture.style", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.architectureStyle}
                            placeholder="e.g., Clean Architecture, MVC..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>State Management</Label>
                        <TagInput
                            value={value.architecture.stateManagement}
                            onChange={(tags) => updateMetadata("architecture.stateManagement", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.stateManagement}
                            placeholder="e.g., Redux, Context API..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="directoryStructure">Directory Structure</Label>
                        <Textarea
                            id="directoryStructure"
                            placeholder="Describe your folder organization..."
                            value={value.architecture.directoryStructure}
                            onChange={(e) => updateMetadata("architecture.directoryStructure", e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Authentication & Authorization */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Authentication & Authorization</CardTitle>
                    <CardDescription>How your project handles authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Authentication Approach</Label>
                        <TagInput
                            value={value.authStrategy.approach}
                            onChange={(tags) => updateMetadata("authStrategy.approach", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.authApproach}
                            placeholder="e.g., JWT, OAuth2..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="authImplementation">Implementation Details</Label>
                        <Textarea
                            id="authImplementation"
                            placeholder="Describe your authentication implementation..."
                            value={value.authStrategy.implementation}
                            onChange={(e) => updateMetadata("authStrategy.implementation", e.target.value)}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Deployment */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Deployment</CardTitle>
                    <CardDescription>Deployment environment and CI/CD configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Deployment Environment</Label>
                        <TagInput
                            value={value.deployment.environment}
                            onChange={(tags) => updateMetadata("deployment.environment", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.deploymentEnvironment}
                            placeholder="e.g., AWS, Docker, Kubernetes..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>CI/CD Tools</Label>
                        <TagInput
                            value={value.deployment.cicd}
                            onChange={(tags) => updateMetadata("deployment.cicd", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.cicdTools}
                            placeholder="e.g., GitHub Actions, Jenkins..."
                        />
                    </div>
                </CardContent>
            </Card>

            {/* External Services */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>External Services</CardTitle>
                    <CardDescription>Third-party services and APIs used by your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {value.externalServices.map((service, index) => (
                        <div key={index} className="p-4 border rounded-md space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-sm font-medium">Service {index + 1}</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeExternalService(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <Input
                                placeholder="Service name"
                                value={service.name}
                                onChange={(e) => updateExternalService(index, "name", e.target.value)}
                            />
                            <Input
                                placeholder="Purpose"
                                value={service.purpose}
                                onChange={(e) => updateExternalService(index, "purpose", e.target.value)}
                            />
                            <Input
                                placeholder="API Documentation URL"
                                value={service.apiDocs}
                                onChange={(e) => updateExternalService(index, "apiDocs", e.target.value)}
                            />
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addExternalService} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add External Service
                    </Button>
                </CardContent>
            </Card>

            {/* Standards & Conventions */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Standards & Conventions</CardTitle>
                    <CardDescription>Coding standards and development conventions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="codingStyleGuide">Coding Style Guide</Label>
                        <Select
                            value={value.standards.codingStyle.guide}
                            onValueChange={(val) => updateMetadata("standards.codingStyle.guide", val)}
                        >
                            <SelectTrigger id="codingStyleGuide">
                                <SelectValue placeholder="Select style guide" />
                            </SelectTrigger>
                            <SelectContent>
                                {PROJECT_METADATA_CONSTANTS.codingStyleGuide.map((guide) => (
                                    <SelectItem key={guide} value={guide}>
                                        {guide}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Linters & Formatters</Label>
                        <TagInput
                            value={value.standards.codingStyle.linter}
                            onChange={(tags) => updateMetadata("standards.codingStyle.linter", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.linters}
                            placeholder="e.g., ESLint, Prettier..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Error Handling Patterns</Label>
                        <TagInput
                            value={value.standards.errorHandling}
                            onChange={(tags) => updateMetadata("standards.errorHandling", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.errorHandlingPatterns}
                            placeholder="e.g., Try-Catch, Error Boundaries..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Logging Convention</Label>
                        <TagInput
                            value={value.standards.loggingConvention}
                            onChange={(tags) => updateMetadata("standards.loggingConvention", tags)}
                            suggestions={PROJECT_METADATA_CONSTANTS.loggingTools}
                            placeholder="e.g., Winston, Pino..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="namingConventions">Naming Conventions</Label>
                        <Textarea
                            id="namingConventions"
                            placeholder="Describe naming conventions or link to guide..."
                            value={value.standards.namingConventions}
                            onChange={(e) => updateMetadata("standards.namingConventions", e.target.value)}
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Quality Gates */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Quality Gates</CardTitle>
                    <CardDescription>Testing requirements and quality standards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Definition of Done</Label>
                        <div className="space-y-2">
                            {value.qualityGates.definitionOfDone.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Item ${index + 1}`}
                                        value={item}
                                        onChange={(e) => updateArrayItem("qualityGates.definitionOfDone", index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("qualityGates.definitionOfDone", index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem("qualityGates.definitionOfDone")}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>Code Review Checklist</Label>
                        <div className="space-y-2">
                            {value.qualityGates.codeReviewChecklist.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder={`Item ${index + 1}`}
                                        value={item}
                                        onChange={(e) => updateArrayItem("qualityGates.codeReviewChecklist", index, e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeArrayItem("qualityGates.codeReviewChecklist", index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addArrayItem("qualityGates.codeReviewChecklist")}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label>Testing Requirements</Label>
                        <div className="space-y-2">
                            <Label htmlFor="testCoverage" className="text-sm text-muted-foreground">
                                Test Coverage Target (%)
                            </Label>
                            <Input
                                id="testCoverage"
                                type="number"
                                min="0"
                                max="100"
                                value={value.qualityGates.testingRequirements.coverage}
                                onChange={(e) =>
                                    updateMetadata("qualityGates.testingRequirements.coverage", parseInt(e.target.value) || 0)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Test Types</Label>
                            <TagInput
                                value={value.qualityGates.testingRequirements.testTypes}
                                onChange={(tags) => updateMetadata("qualityGates.testingRequirements.testTypes", tags)}
                                suggestions={PROJECT_METADATA_CONSTANTS.testTypes}
                                placeholder="e.g., Unit, Integration, E2E..."
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label htmlFor="documentationStandards">Documentation Standards</Label>
                        <Textarea
                            id="documentationStandards"
                            placeholder="Describe documentation requirements..."
                            value={value.qualityGates.documentationStandards}
                            onChange={(e) => updateMetadata("qualityGates.documentationStandards", e.target.value)}
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
