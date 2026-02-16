import axios from "axios";
import { API_BASE_URL, API_CONFIG } from "@/lib/config";
import { getSession, signOut } from "next-auth/react";

/**
 * Axios instance configured for h2bis-pb-api
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: API_CONFIG.TIMEOUT,
});

/**
 * Request interceptor
 * Automatically adds JWT token from NextAuth session.
 * Calling getSession() triggers the NextAuth JWT callback,
 * which proactively refreshes the access token if near expiry.
 */
apiClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();

        // If session has a refresh error, sign out immediately
        if (session?.error === 'RefreshTokenError') {
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                await signOut({ callbackUrl: '/login?session=expired' });
            }
            return Promise.reject(new Error('Session expired'));
        }

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Safety net for 401 errors - triggers session refresh via NextAuth
 * and retries the failed request. The primary refresh happens proactively
 * in the request interceptor via getSession().
 */
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints
            const isAuthEndpoint = originalRequest.url?.includes('/auth/login') ||
                originalRequest.url?.includes('/auth/register') ||
                originalRequest.url?.includes('/auth/refresh');

            if (isAuthEndpoint || !originalRequest.headers?.Authorization) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Trigger NextAuth JWT callback to refresh the token server-side
                const session = await getSession();

                if (session?.error === 'RefreshTokenError' || !session?.accessToken) {
                    throw new Error('Refresh failed');
                }

                const newToken = session.accessToken;
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                processQueue(null, newToken);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                    await signOut({ callbackUrl: '/login?session=expired' });
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Log non-401 errors
        if (error.response?.status !== 401) {
            // eslint-disable-next-line no-console
            console.error("API Error:", {
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status,
                message: error.response?.data?.message || error.response?.data?.error || error.message,
            });
        }

        return Promise.reject(error);
    }
);
