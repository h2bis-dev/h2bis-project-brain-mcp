import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

/**
 * Axios instance configured for h2bis-pb-api
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds
});

/**
 * Request interceptor
 * Add authentication token if needed in the future
 */
apiClient.interceptors.request.use(
    (config) => {
        // Future: Add auth token
        // const token = getToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
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
