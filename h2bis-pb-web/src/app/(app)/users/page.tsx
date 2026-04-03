'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession, signOut } from 'next-auth/react';
import { userService } from '@/services/user.service';
import { useDeleteUser } from '@/hooks/useAuth';
import { RegisterUserModal } from '@/components/users/RegisterUserModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { User } from '@/types/auth.types';

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (role === 'admin') return 'destructive';
    if (role === 'agent') return 'secondary';
    return 'default';
}

export default function UsersPage() {
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
    const queryClient = useQueryClient();
    const { data: session } = useSession();

    const { data: users = [], isLoading, isError } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => userService.listAllUsers(),
    });

    const deactivateMutation = useMutation({
        mutationFn: (userId: string) => userService.deactivateUser(userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    const activateMutation = useMutation({
        mutationFn: (userId: string) => userService.approveUser(userId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    });

    const deleteMutation = useDeleteUser();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage user accounts. New users are created by admins only.
                    </p>
                </div>
                <Button onClick={() => setRegisterModalOpen(true)}>
                    Register New User
                </Button>
            </div>

            {isLoading && (
                <div className="flex items-center justify-center py-16 text-muted-foreground">
                    Loading users...
                </div>
            )}

            {isError && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
                    Failed to load users. Please refresh the page.
                </div>
            )}

            {!isLoading && !isError && users.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                    <p className="text-lg font-medium">No users yet</p>
                    <p className="text-sm">Click &quot;Register New User&quot; to create the first account.</p>
                </div>
            )}

            {!isLoading && users.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium text-muted-foreground">
                            {users.length} {users.length === 1 ? 'user' : 'users'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left px-4 py-3 font-medium">Name</th>
                                        <th className="text-left px-4 py-3 font-medium">Email</th>
                                        <th className="text-left px-4 py-3 font-medium">Role</th>
                                        <th className="text-left px-4 py-3 font-medium">Status</th>
                                        <th className="text-right px-4 py-3 font-medium">MCP Access</th>
                                        <th className="text-right px-4 py-3 font-medium">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const uid = user._id || user.id;
                                        const isPending =
                                            deactivateMutation.isPending ||
                                            activateMutation.isPending;

                                        return (
                                            <tr key={uid} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    {user.name || '—'}
                                                    {user.mustChangePassword && (
                                                        <span
                                                            className="ml-2 text-xs text-amber-600 font-normal"
                                                            title="Awaiting first login"
                                                        >
                                                            (awaiting first login)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1 flex-wrap">
                                                        {(user.role ?? ['user']).map((r) => (
                                                            <Badge
                                                                key={r}
                                                                variant={roleBadgeVariant(r)}
                                                                className="capitalize text-xs"
                                                            >
                                                                {r}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Badge
                                                        variant={user.isActive ? 'default' : 'outline'}
                                                        className="text-xs"
                                                    >
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-1 flex-wrap">
                                                        {user.isActive ? (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isPending || deleteMutation.isPending}
                                                                onClick={() => deactivateMutation.mutate(uid!)}
                                                            >
                                                                Deactivate
                                                            </Button>
                                                        ) : (
                                                            !user.mustChangePassword && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-green-700 border-green-300 hover:bg-green-50"
                                                                        disabled={isPending || deleteMutation.isPending}
                                                                        onClick={() => activateMutation.mutate(uid!)}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        className="text-destructive border-destructive/30 hover:bg-destructive/5"
                                                                        disabled={isPending || deleteMutation.isPending}
                                                                        onClick={() => setDeleteTarget({ id: uid!, label: 'Reject' })}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                        disabled={deleteMutation.isPending}
                                                        onClick={() => setDeleteTarget({ id: uid!, label: 'Delete' })}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            <RegisterUserModal
                open={registerModalOpen}
                onOpenChange={setRegisterModalOpen}
            />

            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {deleteTarget?.label === 'Reject' ? 'Reject user?' : 'Delete user?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.label === 'Reject'
                                ? 'This will permanently remove the user account. This action cannot be undone.'
                                : 'This will permanently delete the user account. This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={async () => {
                                if (!deleteTarget) return;
                                const targetId = deleteTarget.id;
                                const isSelf = session?.user?.id === targetId;
                                setDeleteTarget(null);
                                await deleteMutation.mutateAsync(targetId);
                                if (isSelf) {
                                    await signOut({ callbackUrl: '/login' });
                                }
                            }}
                        >
                            {deleteTarget?.label === 'Reject' ? 'Reject' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
