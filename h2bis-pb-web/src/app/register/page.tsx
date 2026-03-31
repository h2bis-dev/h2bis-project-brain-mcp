'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Self-registration has been disabled.
 * Users are created by an administrator via the Users management page.
 * Visiting this URL redirects to the login page.
 */
export default function RegisterPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return null;
}
