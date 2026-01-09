export type Role = 'admin' | 'user' | 'viewer';

export type Permission =
    | 'read:use-cases'
    | 'write:use-cases'
    | 'delete:use-cases'
    | 'read:capabilities'
    | 'write:capabilities'
    | 'delete:capabilities'
    | 'manage:users';

const rolePermissions: Record<Role, Permission[]> = {
    admin: [
        'read:use-cases',
        'write:use-cases',
        'delete:use-cases',
        'read:capabilities',
        'write:capabilities',
        'delete:capabilities',
        'manage:users',
    ],
    user: [
        'read:use-cases',
        'write:use-cases',
        'read:capabilities',
        'write:capabilities',
    ],
    viewer: [
        'read:use-cases',
        'read:capabilities',
    ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
    return rolePermissions[role] ?? [];
}
