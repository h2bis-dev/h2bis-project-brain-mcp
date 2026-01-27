import axios from "axios";
import { API_BASE_URL, API_CONFIG } from "@/lib/config";
import { getSession } from "next-auth/react";

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
 * Automatically adds JWT token from NextAuth session
 */
apiClient.interceptors.request.use(
    async (config) => {
        // Get the session to retrieve the access token
        const session = await getSession();

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Global error handling
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message
        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "An unexpected error occurred";

        console.error("API Error:", {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message,
        });

        // You can add global error handling here
        // For example, show toast notification

        return Promise.reject(error);
    }
);
