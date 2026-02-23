import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Public routes
                if (pathname.startsWith('/login') ||
                    pathname.startsWith('/register') ||
                    pathname.startsWith('/forgot-password') ||
                    pathname === '/') {
                    return true;
                }

                // Token exists but is in error state — force re-authentication
                if (token?.error === 'RefreshTokenError') {
                    return false;
                }

                // Protected routes require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/use-cases/:path*',
        '/capabilities/:path*',
        '/summaries/:path*',
        '/analytics/:path*',
        '/login',
        '/register',
        '/forgot-password',
    ],
};
