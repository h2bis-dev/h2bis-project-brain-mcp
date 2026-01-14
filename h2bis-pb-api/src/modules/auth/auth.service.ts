import mongoose from "mongoose";
import { User } from "../../models/user_model.js";
import { hashPassword, verifyPassword } from "./password.service.js";

export async function registerUser(
    email: string, password: string, name: string
) {
    // Check if user already exists with this email
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
        email,
        passwordHash,
        isActive: true,
        name,
    });

    return user;
}

export async function authenticateUser(
    email: string,
    password: string
) {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
        throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
        throw new Error("Account is inactive");
    }

    return {
        id: user._id.toString(),
        email: user.email,
        role: user.role || ["user"],
        isActive: user.isActive
    };
}
