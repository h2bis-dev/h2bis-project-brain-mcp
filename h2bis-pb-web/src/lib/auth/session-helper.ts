import { getSession } from 'next-auth/react';

/**
 * Get the API access token from the current session
 * Use this to make authenticated API calls
 */
export async function getAccessToken(): Promise<string | null> {
    const session = await getSession();
    return session?.accessToken || null;
}

/**
 * Create an authenticated fetch with Authorization header
 * Automatically includes the JWT from NextAuth session
 */
export async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = await getAccessToken();

    if (!token) {
        throw new Error('No access token available. Please login.');
    }

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        ...options,
        headers,
    });
}

/**
 * Example usage:
 * 
 * // Get current user from protected endpoint
 * const response = await authenticatedFetch('https://api-project-brain-dev.h2bis.com/api/auth/me');
 * const data = await response.json();
 */
