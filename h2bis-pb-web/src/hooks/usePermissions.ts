import { useSession } from 'next-auth/react';

/**
 * Get all permissions for the current user
 * Permissions are computed by the backend (Authorization Contract)
 */
export function usePermissions(): string[] {
    const { data: session } = useSession();
    return session?.user?.permissions || [];
}

/**
 * Check if the current user has a specific permission
 * 
 * @example
 * const canDevelop = useHasPermission('access:develop');
 * if (canDevelop) { // show develop button }
 */
export function useHasPermission(permission: string): boolean {
    const permissions = usePermissions();
    return permissions.includes(permission);
}

/**
 * Check if the current user has ANY of the specified permissions
 * Returns true if user has at least one permission
 */
export function useHasAnyPermission(requiredPermissions: string[]): boolean {
    const permissions = usePermissions();
    return requiredPermissions.some(p => permissions.includes(p));
}

/**
 * Check if the current user has ALL of the specified permissions
 * Returns true only if user has every permission
 */
export function useHasAllPermissions(requiredPermissions: string[]): boolean {
    const permissions = usePermissions();
    return requiredPermissions.every(p => permissions.includes(p));
}

/**
 * Get current user's roles
 * Useful for displaying role badges or role-specific UI
 */
export function useUserRoles(): string[] {
    const { data: session } = useSession();
    return session?.user?.role || [];
}

/**
 * Check if current user has a specific role
 * Note: In most cases, you should use useHasPermission instead
 * This is mainly for role-specific UI (e.g., showing role badges)
 */
export function useHasRole(role: string): boolean {
    const roles = useUserRoles();
    return roles.includes(role);
}
