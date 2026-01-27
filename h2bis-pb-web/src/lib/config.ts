/**
 * Application Configurations
 * This is the SINGLE SOURCE OF TRUTH for all app configuration.
 */

// ========================================
// Environment Variables
// ========================================

// API Base URL - Backend server address (REQUIRED)
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Application Name
export const APP_NAME =
    process.env.NEXT_PUBLIC_APP_NAME || 'H2BIS ProjectBrain';

// NextAuth Secret (REQUIRED for production)
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// NextAuth URL (OPTIONAL - auto-detected in most cases)
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

// Google OAuth Client ID (OPTIONAL - only if using Google auth)
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Google OAuth Client Secret (OPTIONAL - only if using Google auth)
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// ========================================
// API Configuration
// ========================================

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    TIMEOUT: 150000, // 150 seconds for AI generation
    RETRY_ATTEMPTS: 3,
} as const;

// ========================================
// API Endpoints
// ========================================

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
    },
    USE_CASES: {
        LIST: '/api/use-cases',
        GET: (id: string) => `/api/use-cases/${id}`,
        CREATE: '/api/use-cases',
        UPDATE: (id: string) => `/api/use-cases/${id}`,
        DELETE: (id: string) => `/api/use-cases/${id}`,
        GENERATE: '/api/use-cases/generate',
    },
    CAPABILITIES: {
        LIST: '/api/capabilities',
        GET: (id: string) => `/api/capabilities/${id}`,
    },
} as const;

// ========================================
// Application Constants
// ========================================

export const APP_DESCRIPTION = 'Project Brain - Knowledge Management System';

// ========================================
// UI Constants
// ========================================

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE_MB = 10;
