// Auth Request DTOs
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role: string[]; // Array of roles (e.g., ['user'] or ['admin'])
}

/** Admin-only: create a user without providing a password. */
export interface AdminCreateUserRequest {
    email: string;
    name: string;
    role: string[];
}

/** Response after admin creates a user — tempPassword is shown exactly once. */
export interface AdminCreateUserResponse {
    id: string;
    email: string;
    name: string;
    role: string[];
    tempPassword: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

// Auth Response DTOs
export interface AuthResponse {
    id: string;
    email: string;
    role?: string[];
    isActive?: boolean;
    mustChangePassword?: boolean;
}

export interface RegisterResponse {
    id: string;
    email: string;
}

// User type
export interface User {
    id: string;
    _id?: string;
    email: string;
    name?: string;
    role?: string[];
    isActive?: boolean;
    mustChangePassword?: boolean;
    createdAt?: string;
}
