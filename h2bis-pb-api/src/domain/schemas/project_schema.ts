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

        // Software Development Project Metadata
        type: { type: String, enum: ['software_development'], default: 'software_development' },
        metadata: {
            repository: { type: String, default: '' },
            techStack: { type: [String], default: [] },
            language: { type: String, default: '' },
            framework: { type: String, default: '' }
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
    owner: string;
    members: ProjectMember[];
    accessControl: ProjectAccessControl;
    type: 'software_development';
    metadata: {
        repository: string;
        techStack: string[];
        language: string;
        framework: string;
    };
    stats: {
        useCaseCount: number;
        capabilityCount: number;
        completionPercentage: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
