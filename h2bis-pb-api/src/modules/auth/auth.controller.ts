import { Request, Response } from "express";
import { registerUser, authenticateUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
    console.log('🟢 Registration request received:', {
        body: req.body,
        hasUsername: !!req.body.username,
        hasPassword: !!req.body.password,
        hasName: !!req.body.name
    });

    const { username, password, name } = req.body;

    try {
        const user = await registerUser(username, password, name);
        console.log('✅ User registered successfully:', user.username);
        res.status(201).json({ id: user._id.toString(), username: user.username });
    } catch (error) {
        console.error('❌ Registration error:', error);
        const message = error instanceof Error ? error.message : "Failed to register user";
        res.status(400).json({ error: message });
    }
}

export async function login(req: Request, res: Response) {
    const { username, password } = req.body;

    try {
        const user = await authenticateUser(username, password);
        res.status(200).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to login";
        res.status(401).json({ error: message });
    }
}
