import 'next-auth';
import 'next-auth/jwt';

/**
 * Extend NextAuth types to support Authorization Contract
 * Backend returns { roles, permissions } - we store both
 */
declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        role: string[];
        permissions: string[]; // Authorization Contract: backend-computed permissions
        accessToken: string;
        refreshToken: string;
        mustChangePassword: boolean;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role: string[];
            permissions: string[]; // Authorization Contract: use these for access control
            mustChangePassword: boolean;
        };
        accessToken: string;
        refreshToken: string;
        error?: string; // 'RefreshTokenError' when token refresh fails
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        role: string[];
        permissions: string[]; // Authorization Contract: stored in JWT
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number; // Timestamp (ms) when access token expires
        error?: string; // 'RefreshTokenError' when token refresh fails
        mustChangePassword: boolean;
    }
}
