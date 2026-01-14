/**
 * Application constants
 * 
 * This file now re-exports from centralized config.
 * For backwards compatibility, common constants are re-exported here.
 * New code should import from @/lib/config directly.
 */

import {
    APP_NAME,
    API_BASE_URL,
} from './config';

// Re-export from centralized config
export {
    APP_NAME,
    API_BASE_URL,
    API_CONFIG,
    API_ENDPOINTS,
} from './config';

// Application-specific constants
export const ROUTES = {
    HOME: "/",
    DASHBOARD: "/dashboard",
    USE_CASES: "/use-cases",
    USE_CASE_DETAIL: (id: string) => `/use-cases/${id}`,
    USE_CASE_EDIT: (id: string) => `/use-cases/${id}/edit`,
    USE_CASE_NEW: "/use-cases/new",
    CAPABILITIES: "/capabilities",
    CAPABILITY_DETAIL: (id: string) => `/capabilities/${id}`,
    ANALYTICS: "/analytics",
    ANALYTICS_CHAT: "/analytics/chat",
    SUMMARIES: "/summaries",
} as const;

export const COLLECTIONS = {
    USE_CASES: "use_cases",
    FEATURES: "features",
    ENTITIES: "entities",
    CAPABILITIES: "capabilities",
} as const;

export const LIFECYCLE_STATUS = {
    IDEA: "idea",
    PLANNED: "planned",
    IN_DEVELOPMENT: "in_development",
    AI_GENERATED: "ai_generated",
    HUMAN_REVIEWED: "human_reviewed",
    COMPLETED: "completed",
} as const;

export const COMPLEXITY_LEVELS = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
} as const;

export const REVIEW_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    REVISION_REQUESTED: "revision_requested",
} as const;
