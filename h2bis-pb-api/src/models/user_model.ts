import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, unique: true, required: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: [String], enum: ["user", "admin"], default: ["user"] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Create index for efficient email lookups
UserSchema.index({ email: 1 });

export const User = mongoose.model("User", UserSchema);

