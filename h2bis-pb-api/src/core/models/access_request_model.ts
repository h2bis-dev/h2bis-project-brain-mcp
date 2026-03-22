import mongoose from "mongoose";

const AccessRequestSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, lowercase: true, trim: true },
        name: { type: String, required: true },
        githubId: { type: String, required: true },
        githubLogin: { type: String },
        avatarUrl: { type: String },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
        reviewNote: { type: String },
    },
    { timestamps: true }
);

// One pending request per email at a time
AccessRequestSchema.index(
    { email: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } }
);

export const AccessRequest = mongoose.model("AccessRequest", AccessRequestSchema);
