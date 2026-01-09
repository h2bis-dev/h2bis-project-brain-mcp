import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

                try {
                    // Call your API to authenticate
                    const response = await axios.post(`${API_URL}/api/auth/login`, {
                        username: credentials.username,
                        password: credentials.password,
                    });

                    const user = response.data;

                    if (!user) {
                        throw new Error('User not found');
                    }

                    return {
                        id: user.id,
                        email: user.username,
                        name: user.username,
                        role: user.role || 'user',
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    throw new Error('Invalid credentials');
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};
