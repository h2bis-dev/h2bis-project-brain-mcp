'use client';

import { useHasPermission } from '@/hooks/usePermissions';

interface PermissionGuardProps {
    permission: string;
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Permission Guard Component
 * Conditionally renders children based on user permissions
 * 
 * @example
 * <PermissionGuard permission="access:develop">
 *   <DevelopButton />
 * </PermissionGuard>
 */
export function PermissionGuard({ permission, fallback = null, children }: PermissionGuardProps) {
    const hasPermission = useHasPermission(permission);

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
