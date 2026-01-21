/**
 * Authorization Service
 * Single source of truth for permissions and role mappings
 */

// ============================================
// Permission Definitions
// ============================================

export const PERMISSIONS = {
    DASHBOARD: {
        VIEW: 'view:dashboard',
    },
    USE_CASE: {
        VIEW: 'view:use-case',
        CREATE: 'create:use-case',
        EDIT: 'edit:use-case',
        DELETE: 'delete:use-case',
    },
    CAPABILITY: {
        VIEW: 'view:capability',
        MANAGE: 'manage:capability',
    },
    USERS: {
        // Self-management (all users can do on their own account)
        VIEW_OWN: 'view:own-user',
        UPDATE_OWN: 'update:own-user',
        DELETE_OWN: 'delete:own-user',

        // User management (admin operations on any user)
        VIEW_ALL: 'view:all-users',
        CREATE: 'create:user',
        UPDATE_ANY: 'update:any-user',
        DELETE_ANY: 'delete:any-user',
        APPROVE: 'approve:user',
    },
    SYSTEM: {
        ACCESS_DEVELOP: 'access:develop',
        MANAGE_SETTINGS: 'manage:settings',
    },
} as const;

// ============================================
// Role-Permission Mapping
// ============================================

const ROLE_PERMISSION_MAP: Record<string, string[]> = {
    user: [
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.USE_CASE.VIEW,
        PERMISSIONS.USE_CASE.CREATE,
        PERMISSIONS.USE_CASE.EDIT,
        PERMISSIONS.CAPABILITY.VIEW,

        // Self-management (users can manage their own account)
        PERMISSIONS.USERS.VIEW_OWN,
        PERMISSIONS.USERS.UPDATE_OWN,
        PERMISSIONS.USERS.DELETE_OWN,
    ],
    moderator: [
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.USE_CASE.VIEW,
        PERMISSIONS.USE_CASE.CREATE,
        PERMISSIONS.USE_CASE.EDIT,
        PERMISSIONS.USE_CASE.DELETE,
        PERMISSIONS.CAPABILITY.VIEW,
        PERMISSIONS.CAPABILITY.MANAGE,

        // Self-management
        PERMISSIONS.USERS.VIEW_OWN,
        PERMISSIONS.USERS.UPDATE_OWN,
        PERMISSIONS.USERS.DELETE_OWN,
    ],
    admin: [
        // Dashboard & Content
        PERMISSIONS.DASHBOARD.VIEW,
        PERMISSIONS.USE_CASE.VIEW,
        PERMISSIONS.USE_CASE.CREATE,
        PERMISSIONS.USE_CASE.EDIT,
        PERMISSIONS.USE_CASE.DELETE,
        PERMISSIONS.CAPABILITY.VIEW,
        PERMISSIONS.CAPABILITY.MANAGE,

        // User Management (both self and others)
        PERMISSIONS.USERS.VIEW_OWN,
        PERMISSIONS.USERS.UPDATE_OWN,
        PERMISSIONS.USERS.DELETE_OWN,
        PERMISSIONS.USERS.VIEW_ALL,
        PERMISSIONS.USERS.CREATE,
        PERMISSIONS.USERS.UPDATE_ANY,
        PERMISSIONS.USERS.DELETE_ANY,
        PERMISSIONS.USERS.APPROVE,

        // System-level
        PERMISSIONS.SYSTEM.ACCESS_DEVELOP,
        PERMISSIONS.SYSTEM.MANAGE_SETTINGS,
    ],
};

// ============================================
// Permission Utilities
// ============================================

/**
 * Get all permissions for a user based on their roles
 * Handles multiple roles and deduplicates permissions
 */
export function getUserPermissions(roles: string[]): string[] {
    const permissions = new Set<string>();

    roles.forEach(role => {
        const rolePermissions = ROLE_PERMISSION_MAP[role] || [];
        rolePermissions.forEach(permission => permissions.add(permission));
    });

    return Array.from(permissions);
}

/**
 * Check if a user has a specific permission
 * Based on their roles
 */
export function hasPermission(userRoles: string[], permission: string): boolean {
    const userPermissions = getUserPermissions(userRoles);
    return userPermissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userRoles: string[], permissions: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles);
    return permissions.some(permission => userPermissions.includes(permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(userRoles: string[], permissions: string[]): boolean {
    const userPermissions = getUserPermissions(userRoles);
    return permissions.every(permission => userPermissions.includes(permission));
}
