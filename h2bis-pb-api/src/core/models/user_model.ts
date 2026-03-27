import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: false },
        githubId: { type: String, unique: true, sparse: true },
        name: { type: String, required: true },
        role: { type: [String], enum: ["user", "admin", "agent"], default: ["user"] },
        isActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);

