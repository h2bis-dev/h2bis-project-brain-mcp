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
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role: string[];
            permissions: string[]; // Authorization Contract: use these for access control
        };
        accessToken: string;
        refreshToken: string;
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
    }
}
