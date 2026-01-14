import { Request, Response } from "express";
import { registerUser, authenticateUser } from "./auth.service.js";

export async function register(req: Request, res: Response) {
    console.log('🟢 Registration request received:', {
        body: req.body,
        hasEmail: !!req.body.email,
        hasPassword: !!req.body.password,
        hasName: !!req.body.name
    });

    const { email, password, name } = req.body;

    try {
        const user = await registerUser(email, password, name);
        console.log('✅ User registered successfully:', user.email);
        res.status(201).json({
            id: user._id.toString(),
            email: user.email
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        const message = error instanceof Error ? error.message : "Failed to register user";
        res.status(400).json({ error: message });
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        res.status(200).json(user);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to login";
        res.status(401).json({ error: message });
    }
}
