import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        passwordHash: {type: String, required: true},
        name: {type: String, required: true},
        role: {type: [String], enum: ["user", "admin"], default: ["user"]}, 
        isActive: {type: Boolean, default: true},
    }, 
    {   timestamps: true    }
); 

export const User = mongoose.model("User", UserSchema);

