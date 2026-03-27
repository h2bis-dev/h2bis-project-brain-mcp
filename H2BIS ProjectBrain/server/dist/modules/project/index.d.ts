/**
 * Project module barrel
 *
 * Exports the complete list of MCP tool definitions for the project domain.
 * tools/index.ts spreads this array — it never imports individual files from this module.
 * Adding a new project tool only requires changes inside this module.
 */
import { createProject } from './tools/createProject.js';
import { updateProject } from './tools/updateProject.js';
import { getProjectById } from './tools/getProjectById.js';
import { listProjects } from './tools/listProjects.js';
import { upsertProjectDomainModel } from './tools/upsertProjectDomainModel.js';
import { removeProjectDomainModel } from './tools/removeProjectDomainModel.js';
export declare const projectTools: ({
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        status: import("zod").ZodOptional<import("zod").ZodEnum<["active", "archived", "deleted"]>>;
        limit: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
        offset: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodNumber>>;
    }, "strip", import("zod").ZodTypeAny, {
        limit: number;
        offset: number;
        status?: "archived" | "active" | "deleted" | undefined;
    }, {
        status?: "archived" | "active" | "deleted" | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
    handler: typeof listProjects;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        projectId: string;
    }, {
        projectId: string;
    }>;
    handler: typeof getProjectById;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        _id: import("zod").ZodString;
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["planning", "in_development", "in_review", "in_testing", "staging", "production", "maintenance", "archived"]>>;
        accessControl: import("zod").ZodOptional<import("zod").ZodObject<{
            allowAdmins: import("zod").ZodOptional<import("zod").ZodBoolean>;
            allowedRoles: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        }, {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        }>>;
        metadata: import("zod").ZodOptional<import("zod").ZodObject<{
            repository: import("zod").ZodOptional<import("zod").ZodString>;
            techStack: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            language: import("zod").ZodOptional<import("zod").ZodString>;
            framework: import("zod").ZodOptional<import("zod").ZodString>;
            architecture: import("zod").ZodOptional<import("zod").ZodObject<{
                overview: import("zod").ZodOptional<import("zod").ZodString>;
                style: import("zod").ZodOptional<import("zod").ZodString>;
                directoryStructure: import("zod").ZodOptional<import("zod").ZodString>;
                stateManagement: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            }, {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            }>>;
            authStrategy: import("zod").ZodOptional<import("zod").ZodObject<{
                approach: import("zod").ZodOptional<import("zod").ZodString>;
                implementation: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            }, {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            }>>;
            deployment: import("zod").ZodOptional<import("zod").ZodObject<{
                environment: import("zod").ZodOptional<import("zod").ZodString>;
                cicd: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            }, {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            }>>;
            externalServices: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                name: import("zod").ZodString;
                purpose: import("zod").ZodOptional<import("zod").ZodString>;
                apiDocs: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }, {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }>, "many">>;
            standards: import("zod").ZodOptional<import("zod").ZodObject<{
                namingConventions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                errorHandling: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                loggingConvention: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            }, {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            }>>;
            qualityGates: import("zod").ZodOptional<import("zod").ZodObject<{
                definitionOfDone: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                codeReviewChecklist: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                testingRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
                    coverage: import("zod").ZodOptional<import("zod").ZodNumber>;
                    testTypes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    requiresE2ETests: import("zod").ZodOptional<import("zod").ZodBoolean>;
                }, "strip", import("zod").ZodTypeAny, {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                }, {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                }>>;
                documentationStandards: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            }, {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        }, {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        _id: string;
        description?: string | undefined;
        lifecycle?: "planning" | "in_development" | "in_review" | "in_testing" | "staging" | "production" | "maintenance" | "archived" | undefined;
        accessControl?: {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        } | undefined;
        metadata?: {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        name: string;
        _id: string;
        description?: string | undefined;
        lifecycle?: "planning" | "in_development" | "in_review" | "in_testing" | "staging" | "production" | "maintenance" | "archived" | undefined;
        accessControl?: {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        } | undefined;
        metadata?: {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        } | undefined;
    }>;
    handler: typeof createProject;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["planning", "in_development", "in_review", "in_testing", "staging", "production", "maintenance", "archived"]>>;
        accessControl: import("zod").ZodOptional<import("zod").ZodObject<{
            allowAdmins: import("zod").ZodOptional<import("zod").ZodBoolean>;
            allowedRoles: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        }, {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        }>>;
        metadata: import("zod").ZodOptional<import("zod").ZodObject<{
            repository: import("zod").ZodOptional<import("zod").ZodString>;
            techStack: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            language: import("zod").ZodOptional<import("zod").ZodString>;
            framework: import("zod").ZodOptional<import("zod").ZodString>;
            architecture: import("zod").ZodOptional<import("zod").ZodObject<{
                overview: import("zod").ZodOptional<import("zod").ZodString>;
                style: import("zod").ZodOptional<import("zod").ZodString>;
                directoryStructure: import("zod").ZodOptional<import("zod").ZodString>;
                stateManagement: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            }, {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            }>>;
            authStrategy: import("zod").ZodOptional<import("zod").ZodObject<{
                approach: import("zod").ZodOptional<import("zod").ZodString>;
                implementation: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            }, {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            }>>;
            deployment: import("zod").ZodOptional<import("zod").ZodObject<{
                environment: import("zod").ZodOptional<import("zod").ZodString>;
                cicd: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            }, {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            }>>;
            externalServices: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                name: import("zod").ZodString;
                purpose: import("zod").ZodOptional<import("zod").ZodString>;
                apiDocs: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }, {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }>, "many">>;
            standards: import("zod").ZodOptional<import("zod").ZodObject<{
                namingConventions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                errorHandling: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                loggingConvention: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            }, "strip", import("zod").ZodTypeAny, {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            }, {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            }>>;
            qualityGates: import("zod").ZodOptional<import("zod").ZodObject<{
                definitionOfDone: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                codeReviewChecklist: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                testingRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
                    coverage: import("zod").ZodOptional<import("zod").ZodNumber>;
                    testTypes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
                    requiresE2ETests: import("zod").ZodOptional<import("zod").ZodBoolean>;
                }, "strip", import("zod").ZodTypeAny, {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                }, {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                }>>;
                documentationStandards: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            }, {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        }, {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        projectId: string;
        name?: string | undefined;
        description?: string | undefined;
        lifecycle?: "planning" | "in_development" | "in_review" | "in_testing" | "staging" | "production" | "maintenance" | "archived" | undefined;
        accessControl?: {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        } | undefined;
        metadata?: {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        } | undefined;
    }, {
        projectId: string;
        name?: string | undefined;
        description?: string | undefined;
        lifecycle?: "planning" | "in_development" | "in_review" | "in_testing" | "staging" | "production" | "maintenance" | "archived" | undefined;
        accessControl?: {
            allowAdmins?: boolean | undefined;
            allowedRoles?: string[] | undefined;
        } | undefined;
        metadata?: {
            repository?: string | undefined;
            techStack?: string[] | undefined;
            language?: string | undefined;
            framework?: string | undefined;
            architecture?: {
                overview?: string | undefined;
                style?: string | undefined;
                directoryStructure?: string | undefined;
                stateManagement?: string[] | undefined;
            } | undefined;
            authStrategy?: {
                approach?: string | undefined;
                implementation?: string[] | undefined;
            } | undefined;
            deployment?: {
                environment?: string | undefined;
                cicd?: string[] | undefined;
            } | undefined;
            externalServices?: {
                name: string;
                purpose?: string | undefined;
                apiDocs?: string | undefined;
            }[] | undefined;
            standards?: {
                namingConventions?: string[] | undefined;
                errorHandling?: string[] | undefined;
                loggingConvention?: string[] | undefined;
            } | undefined;
            qualityGates?: {
                definitionOfDone?: string[] | undefined;
                codeReviewChecklist?: string[] | undefined;
                testingRequirements?: {
                    coverage?: number | undefined;
                    testTypes?: string[] | undefined;
                    requiresE2ETests?: boolean | undefined;
                } | undefined;
                documentationStandards?: string | undefined;
            } | undefined;
        } | undefined;
    }>;
    handler: typeof updateProject;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodString;
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        layer: import("zod").ZodOptional<import("zod").ZodEnum<["data", "dto", "domain", "response", "request", "event", "other"]>>;
        fields: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            type: import("zod").ZodString;
            required: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            defaultValue: import("zod").ZodOptional<import("zod").ZodString>;
            constraints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: string;
            name: string;
            required: boolean;
            constraints: string[];
            description?: string | undefined;
            defaultValue?: string | undefined;
        }, {
            type: string;
            name: string;
            required?: boolean | undefined;
            description?: string | undefined;
            defaultValue?: string | undefined;
            constraints?: string[] | undefined;
        }>, "many">>>;
        usedByUseCases: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        addedBy: import("zod").ZodOptional<import("zod").ZodString>;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        projectId: string;
        fields: {
            type: string;
            name: string;
            required: boolean;
            constraints: string[];
            description?: string | undefined;
            defaultValue?: string | undefined;
        }[];
        usedByUseCases: string[];
        description?: string | undefined;
        layer?: "data" | "dto" | "domain" | "response" | "request" | "event" | "other" | undefined;
        addedBy?: string | undefined;
    }, {
        name: string;
        projectId: string;
        description?: string | undefined;
        layer?: "data" | "dto" | "domain" | "response" | "request" | "event" | "other" | undefined;
        fields?: {
            type: string;
            name: string;
            required?: boolean | undefined;
            description?: string | undefined;
            defaultValue?: string | undefined;
            constraints?: string[] | undefined;
        }[] | undefined;
        usedByUseCases?: string[] | undefined;
        addedBy?: string | undefined;
    }>;
    handler: typeof upsertProjectDomainModel;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodString;
        modelName: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        projectId: string;
        modelName: string;
    }, {
        projectId: string;
        modelName: string;
    }>;
    handler: typeof removeProjectDomainModel;
})[];
//# sourceMappingURL=index.d.ts.map