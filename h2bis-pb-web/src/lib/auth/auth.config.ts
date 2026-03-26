import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { API_BASE_URL, NEXTAUTH_SECRET } from '@/lib/config';

// SERVER_API_URL is for server-side calls (NextAuth authorize, token refresh).
// In Docker, process.env.API_URL overrides to the internal service name.
// Otherwise it falls back to the cloud API URL.
const SERVER_API_URL = process.env.API_URL || API_BASE_URL;

// Access token lifetime in ms (15 min), with 1-min buffer for proactive refresh
const ACCESS_TOKEN_BUFFER_MS = 14 * 60 * 1000;

/**
 * Refresh the access token by calling the backend refresh endpoint.
 * Returns the updated JWT token, or the original token with an error flag on failure.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        const response = await axios.post(`${SERVER_API_URL}/api/auth/refresh`, {
            refreshToken: token.refreshToken,
        }, {
            timeout: 5000,
        });

        const { accessToken, refreshToken } = response.data;

        return {
            ...token,
            accessToken,
            refreshToken,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_BUFFER_MS,
            error: undefined,
        };
    } catch (error) {
        console.error('Token refresh failed in NextAuth JWT callback:', error);
        return {
            ...token,
            error: 'RefreshTokenError',
        };
    }
}

export const authOptions: NextAuthOptions = {
    secret: NEXTAUTH_SECRET || 'development-secret-change-in-production',
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                // Retry logic to handle API server startup delays
                const maxRetries = 3;
                const retryDelay = 1000; // 1 second

                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        // Call your API to authenticate with email
                        const response = await axios.post(`${SERVER_API_URL}/api/auth/login`, {
                            email: credentials.username, // username field contains email
                            password: credentials.password,
                        }, {
                            timeout: 5000, // 5 second timeout
                        });

                        const user = response.data;

                        if (!user) {
                            throw new Error('User not found');
                        }

                        // Return user with tokens and permissions from API
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.email,
                            role: user.role, // Roles from API
                            permissions: user.permissions, // Permissions from API (Authorization Contract)
                            accessToken: user.accessToken, // JWT from API
                            refreshToken: user.refreshToken, // Refresh token from API
                        };
                    } catch (error: any) {
                        const isConnectionError = error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';

                        // Retry on connection errors, but not on authentication errors
                        if (isConnectionError && attempt < maxRetries) {
                            console.warn(`API connection failed (attempt ${attempt}/${maxRetries}), retrying...`);
                            await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                            continue;
                        }

                        // On final attempt or non-connection errors, throw
                        console.error('Authentication error:', error);
                        if (isConnectionError) {
                            throw new Error('API server is not available. Please try again later.');
                        }
                        throw new Error('Invalid credentials');
                    }
                }

                throw new Error('API server is not available. Please try again later.');
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days (matches refresh token lifetime)
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign-in: populate token from the user object
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    permissions: user.permissions,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: Date.now() + ACCESS_TOKEN_BUFFER_MS,
                    error: undefined,
                };
            }

            // Already in error state — stop retrying, force client to re-authenticate
            if (token.error === 'RefreshTokenError') {
                return token;
            }

            // Subsequent calls: return token if access token is still fresh
            if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token expired or near expiry: refresh it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // Pass token data to the session for client access
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string[];
                session.user.permissions = token.permissions as string[];
            }
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;
            // Surface refresh errors to the client
            session.error = token.error;

            return session;
        },
    },
};
