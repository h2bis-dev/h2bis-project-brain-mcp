import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // key format: project-name
        name: { type: String, required: true, unique: true, trim: true },
        description: { type: String, default: '' },
        status: { type: String, enum: ['active', 'archived', 'deleted'], default: 'active' },

        // RBAC: Who owns and can access this project
        owner: { type: String, required: true }, // userId of the owner
        members: {
            type: [
                {
                    userId: { type: String, required: true },
                    role: {
                        type: String,
                        enum: ['owner', 'admin', 'moderator', 'viewer'],
                        default: 'viewer'
                    },
                    addedAt: { type: Date, default: Date.now }
                }
            ],
            default: []
        },

        // Access control: Which system roles can access this project
        accessControl: {
            // Admin users can always access all projects
            allowAdmins: { type: Boolean, default: true },
            // Specific roles allowed
            allowedRoles: {
                type: [String],
                enum: ['user', 'moderator', 'admin'],
                default: ['user', 'moderator', 'admin']
            }
        },

        // Project Lifecycle Status
        lifecycle: {
            type: String,
            enum: ['planning', 'in_development', 'in_review', 'in_testing', 'staging', 'production', 'maintenance', 'archived'],
            default: 'planning'
        },


        // Developed Endpoints Registry (Auto-populated from use cases)
        developedEndpoints: {
            type: [{
                useCaseId: { type: String, required: true },
                endpoint: { type: String, required: true },
                method: {
                    type: String,
                    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                    required: true
                },
                service: { type: String, required: true },
                description: { type: String, default: '' },
                requestSchema: { type: mongoose.Schema.Types.Mixed, default: {} },
                responseSchema: { type: mongoose.Schema.Types.Mixed, default: {} },
                addedAt: { type: Date, default: Date.now },
                lastScanned: { type: Date }
            }],
            default: []
        },


        // Software Development Project Metadata
        type: { type: String, enum: ['software_development'], default: 'software_development' },
        metadata: {
            // System Context
            repository: { type: String, default: '' },
            techStack: { type: [String], default: [] },
            language: { type: String, default: '' },
            framework: { type: String, default: '' },

            // Architecture
            architecture: {
                overview: { type: String, default: '' },
                style: { type: String, default: '' },
                directoryStructure: { type: String, default: '' },
                stateManagement: { type: [String], default: [] }
            },

            // Authentication & Authorization
            authStrategy: {
                approach: { type: String, default: '' },
                implementation: { type: [String], default: [] }
            },

            // Deployment
            deployment: {
                environment: { type: String, default: '' },
                cicd: { type: [String], default: [] }
            },

            // External Services
            externalServices: {
                type: [{
                    name: { type: String, required: true },
                    purpose: { type: String, default: '' },
                    apiDocs: { type: String, default: '' }
                }],
                default: []
            },

            // Standards & Conventions
            standards: {
                namingConventions: { type: [String], default: [] },
                errorHandling: { type: [String], default: [] },
                loggingConvention: { type: [String], default: [] }
            },

            // Quality Gates
            qualityGates: {
                definitionOfDone: { type: [String], default: [] },
                codeReviewChecklist: { type: [String], default: [] },
                testingRequirements: {
                    coverage: { type: Number, default: 0, min: 0, max: 100 },
                    testTypes: { type: [String], default: [] },
                    requiresE2ETests: { type: Boolean, default: false }
                },
                documentationStandards: { type: [String], default: [] }
            },

            // Project Applications & Services
            // Each entry describes a distinct app or backend service in the project
            // (e.g. Web App, Mobile App, API, Data Service, etc.)
            services: {
                type: [{
                    id:          { type: String, required: true },
                    name:        { type: String, required: true },
                    type: {
                        type: String,
                        enum: ['web-app', 'mobile-app', 'api', 'background-service', 'data-service', 'other'],
                        default: 'other'
                    },
                    language:    { type: String, default: '' },
                    framework:   { type: String, default: '' },
                    techStack:   { type: [String], default: [] },
                    description: { type: String, default: '' },
                    goals:       { type: String, default: '' },
                    repository:  { type: String, default: '' }
                }],
                default: []
            }
        },

        // Domain Model Catalog
        // Maintained by MCP agents when features are developed.
        // Serves as a shared catalog of data-layer, DTO, domain, and other object models
        // to prevent redundant model definitions across use cases.
        domainCatalog: {
            type: [{
                // Model identity
                name: { type: String, required: true },            // e.g. "User", "OrderDto"
                description: { type: String, default: '' },
                layer: {
                    type: String,
                    enum: ['data', 'dto', 'domain', 'response', 'request', 'event', 'other'],
                    default: 'domain'
                },

                // Fields — each can have any supported primitive or composite type
                fields: {
                    type: [{
                        name:         { type: String, required: true },
                        type:         { type: String, required: true }, // free-form: 'string', 'number', 'boolean', 'Date', 'string[]', 'ObjectId', etc.
                        required:     { type: Boolean, default: false },
                        description:  { type: String, default: '' },
                        defaultValue: { type: String, default: '' },
                        constraints:  { type: [String], default: [] }  // e.g. ['unique', 'min:0', 'max:255']
                    }],
                    default: []
                },

                // Traceability
                usedByUseCases: { type: [String], default: [] }, // use case keys that reference this model

                // Audit
                addedBy:   { type: String, default: '' },
                addedAt:   { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now }
            }],
            default: []
        },

        // Project Statistics
        stats: {
            useCaseCount: { type: Number, default: 0 },
            capabilityCount: { type: Number, default: 0 },
            completionPercentage: { type: Number, default: 0 }
        },
    },
    { timestamps: true }
);

// Index for faster queries
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ 'members.userId': 1 });
ProjectSchema.index({ status: 1 });

export const Project = mongoose.model('Project', ProjectSchema);

export interface ProjectMember {
    userId: string;
    role: 'owner' | 'admin' | 'moderator' | 'viewer';
    addedAt: Date;
}

export interface ProjectAccessControl {
    allowAdmins: boolean;
    allowedRoles: string[];
}

export interface DevelopedEndpoint {
    useCaseId: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    service: string;
    description: string;
    requestSchema: any;
    responseSchema: any;
    addedAt: Date;
    lastScanned?: Date;
}

// ── Domain Catalog types ────────────────────────────────────────────────────

export type DomainModelLayer = 'data' | 'dto' | 'domain' | 'response' | 'request' | 'event' | 'other';

export interface DomainModelField {
    name: string;
    /** Free-form type string: 'string', 'number', 'boolean', 'Date', 'string[]', 'ObjectId', custom class name, etc. */
    type: string;
    required: boolean;
    description?: string;
    defaultValue?: string;
    /** Constraint hints, e.g. ['unique', 'min:0', 'max:255'] */
    constraints: string[];
}

export interface DomainModel {
    name: string;
    description?: string;
    layer?: DomainModelLayer;
    fields: DomainModelField[];
    /** Keys of use cases that reference this model */
    usedByUseCases: string[];
    addedBy?: string;
    addedAt?: Date;
    updatedAt?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectDocument {
    _id: string;
    name: string;
    description: string;
    status: 'active' | 'archived' | 'deleted';
    lifecycle: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    owner: string;
    members: ProjectMember[];
    accessControl: ProjectAccessControl;
    type: 'software_development';
    developedEndpoints: DevelopedEndpoint[];
    domainCatalog: DomainModel[];
    metadata: {
        repository: string;
        techStack: string[];
        language: string;
        framework: string;
        architecture: {
            overview: string;
            style: string;
            directoryStructure: string;
            stateManagement: string[];
        };
        authStrategy: {
            approach: string;
            implementation: string[];
        };
        deployment: {
            environment: string;
            cicd: string[];
        };
        externalServices: Array<{
            name: string;
            purpose: string;
            apiDocs: string;
        }>;
        standards: {
            namingConventions: string[];
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
            documentationStandards: string[];
        };
    };
    stats: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

/* ---------- Factory Functions ---------- */

export type CreateProjectProps = {
    _id: string;
    name: string;
    owner: string;
    description?: string;
    status?: 'active' | 'archived' | 'deleted';
    lifecycle?: 'planning' | 'in_development' | 'in_review' | 'in_testing' | 'staging' | 'production' | 'maintenance' | 'archived';
    members?: ProjectMember[];
    accessControl?: ProjectAccessControl;
    developedEndpoints?: DevelopedEndpoint[];
    domainCatalog?: DomainModel[];
    metadata?: any; // Accept flexible metadata structure from DTOs
    stats?: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
};

/**
 * Factory function to create a standardized Project object
 * Centralizes default logic and eliminates verbose manual mapping
 * Note: Timestamps are set manually because repository uses raw MongoDB, not Mongoose
 */
export const createProject = (props: CreateProjectProps): ProjectDocument => {
    const now = new Date();
    
    return {
        _id: props._id,
        name: props.name,
        description: props.description ?? '',
        status: props.status ?? 'active',
        lifecycle: props.lifecycle ?? 'planning',
        owner: props.owner,
        members: props.members ?? [
            {
                userId: props.owner,
                role: 'owner',
                addedAt: now
            }
        ],
        accessControl: props.accessControl ?? {
            allowAdmins: true,
            allowedRoles: ['user', 'moderator', 'admin']
        },
        type: 'software_development',
        developedEndpoints: props.developedEndpoints ?? [],
        domainCatalog: props.domainCatalog ?? [],
        metadata: {
            repository: props.metadata?.repository ?? '',
            techStack: props.metadata?.techStack ?? [],
            language: props.metadata?.language ?? '',
            framework: props.metadata?.framework ?? '',
            architecture: {
                overview: props.metadata?.architecture?.overview ?? '',
                style: props.metadata?.architecture?.style ?? '',
                directoryStructure: props.metadata?.architecture?.directoryStructure ?? '',
                stateManagement: props.metadata?.architecture?.stateManagement ?? []
            },
            authStrategy: {
                approach: props.metadata?.authStrategy?.approach ?? '',
                implementation: props.metadata?.authStrategy?.implementation ?? []
            },
            deployment: {
                environment: props.metadata?.deployment?.environment ?? '',
                cicd: props.metadata?.deployment?.cicd ?? []
            },
            externalServices: props.metadata?.externalServices ?? [],
            standards: {
                namingConventions: props.metadata?.standards?.namingConventions ?? [],
                errorHandling: props.metadata?.standards?.errorHandling ?? [],
                loggingConvention: props.metadata?.standards?.loggingConvention ?? []
            },
            qualityGates: {
                definitionOfDone: props.metadata?.qualityGates?.definitionOfDone ?? [],
                codeReviewChecklist: props.metadata?.qualityGates?.codeReviewChecklist ?? [],
                testingRequirements: {
                    coverage: props.metadata?.qualityGates?.testingRequirements?.coverage ?? 0,
                    testTypes: props.metadata?.qualityGates?.testingRequirements?.testTypes ?? [],
                    requiresE2ETests: props.metadata?.qualityGates?.testingRequirements?.requiresE2ETests ?? false
                },
                documentationStandards: props.metadata?.qualityGates?.documentationStandards ?? []
            }
        },
        stats: props.stats ?? {
            useCaseCount: 0,
            capabilityCount: 0,
            completionPercentage: 0
        },
        createdAt: now,
        updatedAt: now
    };
};
