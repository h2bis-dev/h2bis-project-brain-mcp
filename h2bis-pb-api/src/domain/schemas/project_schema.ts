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
            type: [String],
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
                codingStyle: {
                    guide: { type: String, default: '' },
                    linter: { type: [String], default: [] }
                },
                namingConventions: { type: String, default: '' },
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
                documentationStandards: { type: String, default: '' }
            }
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
    developedEndpoints: string[];
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
    };
    stats: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
