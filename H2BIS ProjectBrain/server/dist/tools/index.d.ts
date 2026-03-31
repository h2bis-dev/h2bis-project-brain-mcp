export declare const tools: ({
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
    handler: typeof import("../modules/project/tools/listProjects.js").listProjects;
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
    handler: typeof import("../modules/project/tools/getProjectById.js").getProjectById;
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
    handler: typeof import("../modules/project/tools/createProject.js").createProject;
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
    handler: typeof import("../modules/project/tools/updateProject.js").updateProject;
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
    handler: typeof import("../modules/project/tools/upsertProjectDomainModel.js").upsertProjectDomainModel;
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
    handler: typeof import("../modules/project/tools/removeProjectDomainModel.js").removeProjectDomainModel;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        projectId: import("zod").ZodOptional<import("zod").ZodString>;
        limit: import("zod").ZodDefault<import("zod").ZodNumber>;
        offset: import("zod").ZodDefault<import("zod").ZodNumber>;
    }, "strip", import("zod").ZodTypeAny, {
        limit: number;
        offset: number;
        projectId?: string | undefined;
    }, {
        projectId?: string | undefined;
        limit?: number | undefined;
        offset?: number | undefined;
    }>;
    handler: typeof import("../modules/use-case/tools/listUseCases.js").listUseCases;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
    }, {
        useCaseId: string;
    }>;
    handler: typeof import("../modules/use-case/tools/getUseCaseById.js").getUseCaseById;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        key: import("zod").ZodString;
        projectId: import("zod").ZodOptional<import("zod").ZodString>;
        name: import("zod").ZodString;
        description: import("zod").ZodString;
        businessValue: import("zod").ZodOptional<import("zod").ZodString>;
        primaryActor: import("zod").ZodOptional<import("zod").ZodString>;
        acceptanceCriteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        stakeholders: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        status: import("zod").ZodOptional<import("zod").ZodObject<{
            lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
            reviewedByHuman: import("zod").ZodOptional<import("zod").ZodBoolean>;
            generatedByAI: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }>>;
        functionalRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
            must: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            should: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            wont: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }>>;
        scope: import("zod").ZodOptional<import("zod").ZodObject<{
            inScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            outOfScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assumptions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            constraints: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }>>;
        interfaces: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodDefault<import("zod").ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
            endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                method: import("zod").ZodString;
                path: import("zod").ZodString;
                request: import("zod").ZodOptional<import("zod").ZodString>;
                response: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }>, "many">>>;
            events: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        }, {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        }>>;
        errorHandling: import("zod").ZodOptional<import("zod").ZodObject<{
            knownErrors: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                condition: import("zod").ZodString;
                expectedBehavior: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                condition: string;
                expectedBehavior: string;
            }, {
                condition: string;
                expectedBehavior: string;
            }>, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        }, {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        }>>;
        quality: import("zod").ZodOptional<import("zod").ZodObject<{
            testTypes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
            performanceCriteria: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            securityConsiderations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        }, {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        }>>;
        aiDirectives: import("zod").ZodOptional<import("zod").ZodObject<{
            generationLevel: import("zod").ZodDefault<import("zod").ZodEnum<["skeleton", "partial", "full"]>>;
            overwritePolicy: import("zod").ZodDefault<import("zod").ZodEnum<["never", "ifEmpty", "always"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        }, {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        }>>;
        flows: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            steps: import("zod").ZodArray<import("zod").ZodString, "many">;
            type: import("zod").ZodDefault<import("zod").ZodEnum<["main", "alternative", "error"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }, {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }>, "many">>;
        technicalSurface: import("zod").ZodOptional<import("zod").ZodObject<{
            backend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                collections: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    purpose: import("zod").ZodString;
                    operations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
                }, "strip", import("zod").ZodTypeAny, {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }, {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }>, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            }, {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            }>>;
            frontend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                routes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                components: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                repos: string[];
                routes: string[];
                components: string[];
            }, {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        }, {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        }>>;
        relationships: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            type: import("zod").ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
            targetType: import("zod").ZodString;
            targetKey: import("zod").ZodString;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }>, "many">>;
        implementationRisk: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            rule: import("zod").ZodString;
            normative: import("zod").ZodDefault<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            rule: string;
            normative: boolean;
        }, {
            rule: string;
            normative?: boolean | undefined;
        }>, "many">>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        normative: import("zod").ZodOptional<import("zod").ZodBoolean>;
        aiMetadata: import("zod").ZodOptional<import("zod").ZodObject<{
            estimatedComplexity: import("zod").ZodOptional<import("zod").ZodEnum<["low", "medium", "high"]>>;
            implementationRisk: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            testStrategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            nonFunctionalRequirements: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            suggestedOrder: import("zod").ZodOptional<import("zod").ZodNumber>;
            normativeMode: import("zod").ZodOptional<import("zod").ZodBoolean>;
            insufficiencyReasons: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }, {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        name: string;
        description: string;
        key: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        errorHandling?: {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        } | undefined;
        projectId?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative: boolean;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        } | undefined;
        quality?: {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        } | undefined;
        aiDirectives?: {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        } | undefined;
        flows?: {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }, {
        name: string;
        description: string;
        key: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        errorHandling?: {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        } | undefined;
        projectId?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative?: boolean | undefined;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        } | undefined;
        quality?: {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        } | undefined;
        aiDirectives?: {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        } | undefined;
        flows?: {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }>;
    handler: typeof import("../modules/use-case/tools/createUseCase.js").createUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        businessValue: import("zod").ZodOptional<import("zod").ZodString>;
        primaryActor: import("zod").ZodOptional<import("zod").ZodString>;
        acceptanceCriteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        stakeholders: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        status: import("zod").ZodOptional<import("zod").ZodObject<{
            lifecycle: import("zod").ZodOptional<import("zod").ZodEnum<["idea", "planned", "in_development", "ai_generated", "human_reviewed", "completed"]>>;
            reviewedByHuman: import("zod").ZodOptional<import("zod").ZodBoolean>;
            generatedByAI: import("zod").ZodOptional<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }, {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        }>>;
        functionalRequirements: import("zod").ZodOptional<import("zod").ZodObject<{
            must: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            should: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            wont: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }, {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        }>>;
        scope: import("zod").ZodOptional<import("zod").ZodObject<{
            inScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            outOfScope: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            assumptions: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
            constraints: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }, {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        }>>;
        interfaces: import("zod").ZodOptional<import("zod").ZodObject<{
            type: import("zod").ZodDefault<import("zod").ZodEnum<["REST", "GraphQL", "Event", "UI"]>>;
            endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                method: import("zod").ZodString;
                path: import("zod").ZodString;
                request: import("zod").ZodOptional<import("zod").ZodString>;
                response: import("zod").ZodOptional<import("zod").ZodString>;
            }, "strip", import("zod").ZodTypeAny, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }, {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }>, "many">>>;
            events: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        }, {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        }>>;
        errorHandling: import("zod").ZodOptional<import("zod").ZodObject<{
            knownErrors: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                condition: import("zod").ZodString;
                expectedBehavior: import("zod").ZodString;
            }, "strip", import("zod").ZodTypeAny, {
                condition: string;
                expectedBehavior: string;
            }, {
                condition: string;
                expectedBehavior: string;
            }>, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        }, {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        }>>;
        quality: import("zod").ZodOptional<import("zod").ZodObject<{
            testTypes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["unit", "integration", "e2e", "security"]>, "many">>>;
            performanceCriteria: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            securityConsiderations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
        }, "strip", import("zod").ZodTypeAny, {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        }, {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        }>>;
        aiDirectives: import("zod").ZodOptional<import("zod").ZodObject<{
            generationLevel: import("zod").ZodDefault<import("zod").ZodEnum<["skeleton", "partial", "full"]>>;
            overwritePolicy: import("zod").ZodDefault<import("zod").ZodEnum<["never", "ifEmpty", "always"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        }, {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        }>>;
        flows: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            name: import("zod").ZodString;
            steps: import("zod").ZodArray<import("zod").ZodString, "many">;
            type: import("zod").ZodDefault<import("zod").ZodEnum<["main", "alternative", "error"]>>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }, {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }>, "many">>;
        technicalSurface: import("zod").ZodOptional<import("zod").ZodObject<{
            backend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                endpoints: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                collections: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
                    name: import("zod").ZodString;
                    purpose: import("zod").ZodString;
                    operations: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<["CREATE", "READ", "UPDATE", "DELETE"]>, "many">>>;
                }, "strip", import("zod").ZodTypeAny, {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }, {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }>, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            }, {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            }>>;
            frontend: import("zod").ZodOptional<import("zod").ZodObject<{
                repos: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                routes: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
                components: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            }, "strip", import("zod").ZodTypeAny, {
                repos: string[];
                routes: string[];
                components: string[];
            }, {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            }>>;
        }, "strip", import("zod").ZodTypeAny, {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        }, {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        }>>;
        relationships: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            type: import("zod").ZodEnum<["depends_on", "extends", "implements", "conflicts_with", "related_to"]>;
            targetType: import("zod").ZodString;
            targetKey: import("zod").ZodString;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        }, "strip", import("zod").ZodTypeAny, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }, {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }>, "many">>;
        implementationRisk: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodObject<{
            rule: import("zod").ZodString;
            normative: import("zod").ZodDefault<import("zod").ZodBoolean>;
        }, "strip", import("zod").ZodTypeAny, {
            rule: string;
            normative: boolean;
        }, {
            rule: string;
            normative?: boolean | undefined;
        }>, "many">>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        normative: import("zod").ZodOptional<import("zod").ZodBoolean>;
        aiMetadata: import("zod").ZodOptional<import("zod").ZodObject<{
            estimatedComplexity: import("zod").ZodOptional<import("zod").ZodEnum<["low", "medium", "high"]>>;
            implementationRisk: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            testStrategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            nonFunctionalRequirements: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>>;
            suggestedOrder: import("zod").ZodOptional<import("zod").ZodNumber>;
            normativeMode: import("zod").ZodOptional<import("zod").ZodBoolean>;
            insufficiencyReasons: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString, "many">>;
        }, "strip", import("zod").ZodTypeAny, {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }, {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        }>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        name?: string | undefined;
        errorHandling?: {
            knownErrors: {
                condition: string;
                expectedBehavior: string;
            }[];
        } | undefined;
        description?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative: boolean;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type: "REST" | "GraphQL" | "Event" | "UI";
            endpoints: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[];
            events: string[];
        } | undefined;
        quality?: {
            testTypes: ("unit" | "integration" | "e2e" | "security")[];
            performanceCriteria: string[];
            securityConsiderations: string[];
        } | undefined;
        aiDirectives?: {
            generationLevel: "skeleton" | "partial" | "full";
            overwritePolicy: "never" | "ifEmpty" | "always";
        } | undefined;
        flows?: {
            type: "error" | "main" | "alternative";
            name: string;
            steps: string[];
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints: string[];
                repos: string[];
                collections: {
                    name: string;
                    purpose: string;
                    operations: ("DELETE" | "CREATE" | "READ" | "UPDATE")[];
                }[];
            } | undefined;
            frontend?: {
                repos: string[];
                routes: string[];
                components: string[];
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            implementationRisk: string[];
            testStrategy: string[];
            nonFunctionalRequirements: string[];
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }, {
        useCaseId: string;
        status?: {
            lifecycle?: "in_development" | "idea" | "planned" | "ai_generated" | "human_reviewed" | "completed" | undefined;
            reviewedByHuman?: boolean | undefined;
            generatedByAI?: boolean | undefined;
        } | undefined;
        name?: string | undefined;
        errorHandling?: {
            knownErrors?: {
                condition: string;
                expectedBehavior: string;
            }[] | undefined;
        } | undefined;
        description?: string | undefined;
        normative?: boolean | undefined;
        implementationRisk?: {
            rule: string;
            normative?: boolean | undefined;
        }[] | undefined;
        businessValue?: string | undefined;
        primaryActor?: string | undefined;
        acceptanceCriteria?: string[] | undefined;
        stakeholders?: string[] | undefined;
        functionalRequirements?: {
            must?: string[] | undefined;
            should?: string[] | undefined;
            wont?: string[] | undefined;
        } | undefined;
        scope?: {
            constraints?: string[] | undefined;
            inScope?: string[] | undefined;
            outOfScope?: string[] | undefined;
            assumptions?: string[] | undefined;
        } | undefined;
        interfaces?: {
            type?: "REST" | "GraphQL" | "Event" | "UI" | undefined;
            endpoints?: {
                path: string;
                method: string;
                response?: string | undefined;
                request?: string | undefined;
            }[] | undefined;
            events?: string[] | undefined;
        } | undefined;
        quality?: {
            testTypes?: ("unit" | "integration" | "e2e" | "security")[] | undefined;
            performanceCriteria?: string[] | undefined;
            securityConsiderations?: string[] | undefined;
        } | undefined;
        aiDirectives?: {
            generationLevel?: "skeleton" | "partial" | "full" | undefined;
            overwritePolicy?: "never" | "ifEmpty" | "always" | undefined;
        } | undefined;
        flows?: {
            name: string;
            steps: string[];
            type?: "error" | "main" | "alternative" | undefined;
        }[] | undefined;
        technicalSurface?: {
            backend?: {
                endpoints?: string[] | undefined;
                repos?: string[] | undefined;
                collections?: {
                    name: string;
                    purpose: string;
                    operations?: ("DELETE" | "CREATE" | "READ" | "UPDATE")[] | undefined;
                }[] | undefined;
            } | undefined;
            frontend?: {
                repos?: string[] | undefined;
                routes?: string[] | undefined;
                components?: string[] | undefined;
            } | undefined;
        } | undefined;
        relationships?: {
            type: "depends_on" | "extends" | "implements" | "conflicts_with" | "related_to";
            targetType: string;
            targetKey: string;
            reason?: string | undefined;
        }[] | undefined;
        tags?: string[] | undefined;
        aiMetadata?: {
            estimatedComplexity?: "low" | "medium" | "high" | undefined;
            implementationRisk?: string[] | undefined;
            testStrategy?: string[] | undefined;
            nonFunctionalRequirements?: string[] | undefined;
            suggestedOrder?: number | undefined;
            normativeMode?: boolean | undefined;
            insufficiencyReasons?: string[] | undefined;
        } | undefined;
    }>;
    handler: typeof import("../modules/use-case/tools/updateUseCase.js").updateUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        enhancementType: import("zod").ZodOptional<import("zod").ZodEnum<["full", "partial", "flows_only", "technical_only"]>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
    }, {
        useCaseId: string;
        enhancementType?: "partial" | "full" | "flows_only" | "technical_only" | undefined;
    }>;
    handler: typeof import("../modules/use-case/tools/enhanceUseCase.js").enhanceUseCase;
} | {
    name: string;
    description: string;
    schema: import("zod").ZodObject<{
        useCaseId: import("zod").ZodString;
        instructions: import("zod").ZodString;
        preserveHumanEdits: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
    }, "strip", import("zod").ZodTypeAny, {
        useCaseId: string;
        instructions: string;
        preserveHumanEdits: boolean;
    }, {
        useCaseId: string;
        instructions: string;
        preserveHumanEdits?: boolean | undefined;
    }>;
    handler: typeof import("../modules/use-case/tools/updateUseCaseWithAI.js").updateUseCaseWithAI;
} | {
    name: string;
    description: string;
    schema: {};
    handler: typeof import("../modules/auth/tools/logout.js").logout;
})[];
//# sourceMappingURL=index.d.ts.map