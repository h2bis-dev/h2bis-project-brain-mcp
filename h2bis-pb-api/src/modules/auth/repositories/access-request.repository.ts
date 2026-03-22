import { AccessRequest } from '../../../core/models/access_request_model.js';

export class AccessRequestRepository {
    async findPendingByEmail(email: string) {
        return AccessRequest.findOne({ email: email.toLowerCase(), status: 'pending' });
    }

    async findPendingByGithubId(githubId: string) {
        return AccessRequest.findOne({ githubId, status: 'pending' });
    }

    async findById(id: string) {
        return AccessRequest.findById(id);
    }

    async findAll(filter: { status?: string } = {}) {
        const query: any = {};
        if (filter.status) query.status = filter.status;
        return AccessRequest.find(query).sort({ createdAt: -1 });
    }

    async create(data: {
        email: string;
        name: string;
        githubId: string;
        githubLogin?: string;
        avatarUrl?: string;
    }) {
        return AccessRequest.create({
            email: data.email.toLowerCase(),
            name: data.name,
            githubId: data.githubId,
            githubLogin: data.githubLogin,
            avatarUrl: data.avatarUrl,
        });
    }

    async updateStatus(
        id: string,
        status: 'approved' | 'rejected',
        reviewedBy: string,
        reviewNote?: string
    ) {
        return AccessRequest.findByIdAndUpdate(
            id,
            {
                $set: {
                    status,
                    reviewedBy,
                    reviewedAt: new Date(),
                    ...(reviewNote ? { reviewNote } : {}),
                },
            },
            { new: true }
        );
    }
}

export const accessRequestRepository = new AccessRequestRepository();
