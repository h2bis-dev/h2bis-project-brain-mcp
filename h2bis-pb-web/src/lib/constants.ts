/**
 * Application constants
 */

export const APP_NAME = "H2BIS ProjectBrain";

export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
