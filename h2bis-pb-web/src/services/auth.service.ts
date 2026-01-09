import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface RegisterData {
    username: string;
    password: string;
    name: string;
}

export interface LoginData {
    username: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    username: string;
    role?: string[];
    isActive?: boolean;
}

export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/api/auth/register`, data);
        return response.data;
    },

    /**
     * Login user
     */
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await axios.post(`${API_URL}/api/auth/login`, data);
        return response.data;
    },
};
