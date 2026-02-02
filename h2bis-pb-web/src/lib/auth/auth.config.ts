import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

export const authOptions: NextAuthOptions = {
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
                        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
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
        maxAge: 60 * 60, // 1 hour (matches API access token expiry)
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            // On sign in, store the user info, tokens, and permissions
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.role = user.role; // Store role array
                token.permissions = user.permissions; // Store permissions (Authorization Contract)
                token.accessToken = user.accessToken; // Store API access token
                token.refreshToken = user.refreshToken; // Store API refresh token
            }
            return token;
        },
        async session({ session, token }) {
            // Pass token data to the session for client access
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string[];
                session.user.permissions = token.permissions as string[]; // Permissions for UI access control
            }
            // Add tokens to session for API calls
            session.accessToken = token.accessToken as string;
            session.refreshToken = token.refreshToken as string;

            return session;
        },
    },
};
