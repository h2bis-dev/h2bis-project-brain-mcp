import 'next-auth';
import 'next-auth/jwt';

/**
 * Extend NextAuth types to include custom fields from our API
 */
declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        role: string[];
        accessToken: string;
        refreshToken: string;
    }

    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role: string[];
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
        accessToken: string;
        refreshToken: string;
    }
}
