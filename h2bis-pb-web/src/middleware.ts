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
                if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
                    return true;
                }

                // Protected routes require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/use-cases/:path*',
        '/capabilities/:path*',
        '/summaries/:path*',
        '/analytics/:path*',
        '/login',
        '/register',
    ],
};
