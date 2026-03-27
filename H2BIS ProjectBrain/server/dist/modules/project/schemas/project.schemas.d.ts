import { z } from 'zod';
export declare const LifecycleSchema: z.ZodEnum<["planning", "in_development", "in_review", "in_testing", "staging", "production", "maintenance", "archived"]>;
export declare const AccessControlSchema: z.ZodObject<{
    allowAdmins: z.ZodOptional<z.ZodBoolean>;
    allowedRoles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    allowAdmins?: boolean | undefined;
    allowedRoles?: string[] | undefined;
}, {
    allowAdmins?: boolean | undefined;
    allowedRoles?: string[] | undefined;
}>;
export declare const ProjectMetadataSchema: z.ZodObject<{
    repository: z.ZodOptional<z.ZodString>;
    techStack: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    language: z.ZodOptional<z.ZodString>;
    framework: z.ZodOptional<z.ZodString>;
    architecture: z.ZodOptional<z.ZodObject<{
        overview: z.ZodOptional<z.ZodString>;
        style: z.ZodOptional<z.ZodString>;
        directoryStructure: z.ZodOptional<z.ZodString>;
        stateManagement: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
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
    authStrategy: z.ZodOptional<z.ZodObject<{
        approach: z.ZodOptional<z.ZodString>;
        implementation: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        approach?: string | undefined;
        implementation?: string[] | undefined;
    }, {
        approach?: string | undefined;
        implementation?: string[] | undefined;
    }>>;
    deployment: z.ZodOptional<z.ZodObject<{
        environment: z.ZodOptional<z.ZodString>;
        cicd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        environment?: string | undefined;
        cicd?: string[] | undefined;
    }, {
        environment?: string | undefined;
        cicd?: string[] | undefined;
    }>>;
    externalServices: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        purpose: z.ZodOptional<z.ZodString>;
        apiDocs: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        purpose?: string | undefined;
        apiDocs?: string | undefined;
    }, {
        name: string;
        purpose?: string | undefined;
        apiDocs?: string | undefined;
    }>, "many">>;
    standards: z.ZodOptional<z.ZodObject<{
        namingConventions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        errorHandling: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        loggingConvention: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        namingConventions?: string[] | undefined;
        errorHandling?: string[] | undefined;
        loggingConvention?: string[] | undefined;
    }, {
        namingConventions?: string[] | undefined;
        errorHandling?: string[] | undefined;
        loggingConvention?: string[] | undefined;
    }>>;
    qualityGates: z.ZodOptional<z.ZodObject<{
        definitionOfDone: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        codeReviewChecklist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        testingRequirements: z.ZodOptional<z.ZodObject<{
            coverage: z.ZodOptional<z.ZodNumber>;
            testTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            requiresE2ETests: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            coverage?: number | undefined;
            testTypes?: string[] | undefined;
            requiresE2ETests?: boolean | undefined;
        }, {
            coverage?: number | undefined;
            testTypes?: string[] | undefined;
            requiresE2ETests?: boolean | undefined;
        }>>;
        documentationStandards: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const DomainModelFieldSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    description: z.ZodOptional<z.ZodString>;
    defaultValue: z.ZodOptional<z.ZodString>;
    constraints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
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
}>;
export declare const createProjectSchema: z.ZodObject<{
    _id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    lifecycle: z.ZodOptional<z.ZodEnum<["planning", "in_development", "in_review", "in_testing", "staging", "production", "maintenance", "archived"]>>;
    accessControl: z.ZodOptional<z.ZodObject<{
        allowAdmins: z.ZodOptional<z.ZodBoolean>;
        allowedRoles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowAdmins?: boolean | undefined;
        allowedRoles?: string[] | undefined;
    }, {
        allowAdmins?: boolean | undefined;
        allowedRoles?: string[] | undefined;
    }>>;
    metadata: z.ZodOptional<z.ZodObject<{
        repository: z.ZodOptional<z.ZodString>;
        techStack: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        language: z.ZodOptional<z.ZodString>;
        framework: z.ZodOptional<z.ZodString>;
        architecture: z.ZodOptional<z.ZodObject<{
            overview: z.ZodOptional<z.ZodString>;
            style: z.ZodOptional<z.ZodString>;
            directoryStructure: z.ZodOptional<z.ZodString>;
            stateManagement: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
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
        authStrategy: z.ZodOptional<z.ZodObject<{
            approach: z.ZodOptional<z.ZodString>;
            implementation: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            approach?: string | undefined;
            implementation?: string[] | undefined;
        }, {
            approach?: string | undefined;
            implementation?: string[] | undefined;
        }>>;
        deployment: z.ZodOptional<z.ZodObject<{
            environment: z.ZodOptional<z.ZodString>;
            cicd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            environment?: string | undefined;
            cicd?: string[] | undefined;
        }, {
            environment?: string | undefined;
            cicd?: string[] | undefined;
        }>>;
        externalServices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            purpose: z.ZodOptional<z.ZodString>;
            apiDocs: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            purpose?: string | undefined;
            apiDocs?: string | undefined;
        }, {
            name: string;
            purpose?: string | undefined;
            apiDocs?: string | undefined;
        }>, "many">>;
        standards: z.ZodOptional<z.ZodObject<{
            namingConventions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            errorHandling: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            loggingConvention: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            namingConventions?: string[] | undefined;
            errorHandling?: string[] | undefined;
            loggingConvention?: string[] | undefined;
        }, {
            namingConventions?: string[] | undefined;
            errorHandling?: string[] | undefined;
            loggingConvention?: string[] | undefined;
        }>>;
        qualityGates: z.ZodOptional<z.ZodObject<{
            definitionOfDone: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            codeReviewChecklist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            testingRequirements: z.ZodOptional<z.ZodObject<{
                coverage: z.ZodOptional<z.ZodNumber>;
                testTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                requiresE2ETests: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                coverage?: number | undefined;
                testTypes?: string[] | undefined;
                requiresE2ETests?: boolean | undefined;
            }, {
                coverage?: number | undefined;
                testTypes?: string[] | undefined;
                requiresE2ETests?: boolean | undefined;
            }>>;
            documentationStandards: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
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
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
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
export declare const updateProjectSchema: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    lifecycle: z.ZodOptional<z.ZodEnum<["planning", "in_development", "in_review", "in_testing", "staging", "production", "maintenance", "archived"]>>;
    accessControl: z.ZodOptional<z.ZodObject<{
        allowAdmins: z.ZodOptional<z.ZodBoolean>;
        allowedRoles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        allowAdmins?: boolean | undefined;
        allowedRoles?: string[] | undefined;
    }, {
        allowAdmins?: boolean | undefined;
        allowedRoles?: string[] | undefined;
    }>>;
    metadata: z.ZodOptional<z.ZodObject<{
        repository: z.ZodOptional<z.ZodString>;
        techStack: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        language: z.ZodOptional<z.ZodString>;
        framework: z.ZodOptional<z.ZodString>;
        architecture: z.ZodOptional<z.ZodObject<{
            overview: z.ZodOptional<z.ZodString>;
            style: z.ZodOptional<z.ZodString>;
            directoryStructure: z.ZodOptional<z.ZodString>;
            stateManagement: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
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
        authStrategy: z.ZodOptional<z.ZodObject<{
            approach: z.ZodOptional<z.ZodString>;
            implementation: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            approach?: string | undefined;
            implementation?: string[] | undefined;
        }, {
            approach?: string | undefined;
            implementation?: string[] | undefined;
        }>>;
        deployment: z.ZodOptional<z.ZodObject<{
            environment: z.ZodOptional<z.ZodString>;
            cicd: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            environment?: string | undefined;
            cicd?: string[] | undefined;
        }, {
            environment?: string | undefined;
            cicd?: string[] | undefined;
        }>>;
        externalServices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            purpose: z.ZodOptional<z.ZodString>;
            apiDocs: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            purpose?: string | undefined;
            apiDocs?: string | undefined;
        }, {
            name: string;
            purpose?: string | undefined;
            apiDocs?: string | undefined;
        }>, "many">>;
        standards: z.ZodOptional<z.ZodObject<{
            namingConventions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            errorHandling: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            loggingConvention: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            namingConventions?: string[] | undefined;
            errorHandling?: string[] | undefined;
            loggingConvention?: string[] | undefined;
        }, {
            namingConventions?: string[] | undefined;
            errorHandling?: string[] | undefined;
            loggingConvention?: string[] | undefined;
        }>>;
        qualityGates: z.ZodOptional<z.ZodObject<{
            definitionOfDone: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            codeReviewChecklist: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            testingRequirements: z.ZodOptional<z.ZodObject<{
                coverage: z.ZodOptional<z.ZodNumber>;
                testTypes: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                requiresE2ETests: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                coverage?: number | undefined;
                testTypes?: string[] | undefined;
                requiresE2ETests?: boolean | undefined;
            }, {
                coverage?: number | undefined;
                testTypes?: string[] | undefined;
                requiresE2ETests?: boolean | undefined;
            }>>;
            documentationStandards: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
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
    }, "strip", z.ZodTypeAny, {
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
}, "strip", z.ZodTypeAny, {
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
export declare const getProjectByIdSchema: z.ZodObject<{
    projectId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
}, {
    projectId: string;
}>;
export declare const listProjectsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<["active", "archived", "deleted"]>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    status?: "archived" | "active" | "deleted" | undefined;
}, {
    status?: "archived" | "active" | "deleted" | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const upsertProjectDomainModelSchema: z.ZodObject<{
    projectId: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    layer: z.ZodOptional<z.ZodEnum<["data", "dto", "domain", "response", "request", "event", "other"]>>;
    fields: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        description: z.ZodOptional<z.ZodString>;
        defaultValue: z.ZodOptional<z.ZodString>;
        constraints: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
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
    usedByUseCases: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    addedBy: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
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
export declare const removeProjectDomainModelSchema: z.ZodObject<{
    projectId: z.ZodString;
    modelName: z.ZodString;
}, "strip", z.ZodTypeAny, {
    projectId: string;
    modelName: string;
}, {
    projectId: string;
    modelName: string;
}>;
//# sourceMappingURL=project.schemas.d.ts.map