import { toNamespacedPath } from "path/posix";
import { User } from "../../models/user_model.js";
import { hashPassword, verifyPassword } from "./password.service.js";

export async function registerUser(
    username: string, password: string, name: string
) {
    const existing = await User.findOne({ username });
    if (existing) {
        throw new Error("User already exists");
    }

    const user = await User.create({
        username,
        passwordHash: await hashPassword(password),
        isActive: true,
        name: name,
    });

    return user;
}

export async function authenticateUser(
    username: string,
    password: string
) {
    const user = await User.findOne({ username });

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
        username: user.username,
        role: user.role || ["user"],
        isActive: user.isActive
    };
}
