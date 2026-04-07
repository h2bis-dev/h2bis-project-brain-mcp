import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // If user must change password on first login, force redirect to /change-password
        if (token?.mustChangePassword && !pathname.startsWith('/change-password')) {
            return NextResponse.redirect(new URL('/change-password', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Public routes (no auth required)
                if (pathname.startsWith('/login') ||
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
        '/projects/:path*',
        '/users/:path*',
        '/change-password',
        '/login',
        '/forgot-password',
    ],
};
