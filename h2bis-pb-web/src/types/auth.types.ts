// Auth Request DTOs
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Auth Response DTOs
export interface AuthResponse {
    id: string;
    email: string;
    role?: string[];
    isActive?: boolean;
}

export interface RegisterResponse {
    id: string;
    email: string;
}

// User type
export interface User {
    id: string;
    email: string;
    name?: string;
    role?: string[];
    isActive?: boolean;
}
