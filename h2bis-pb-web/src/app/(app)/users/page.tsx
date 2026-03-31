'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { RegisterUserModal } from '@/components/users/RegisterUserModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types/auth.types';

function roleBadgeVariant(role: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (role === 'admin') return 'destructive';
    if (role === 'agent') return 'secondary';
    return 'default';
}

export default function UsersPage() {
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const queryClient = useQueryClient();

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
                                        <th className="text-right px-4 py-3 font-medium">Actions</th>
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
                                                    {user.isActive ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={isPending}
                                                            onClick={() => deactivateMutation.mutate(uid!)}
                                                        >
                                                            Deactivate
                                                        </Button>
                                                    ) : (
                                                        !user.mustChangePassword && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={isPending}
                                                                onClick={() => activateMutation.mutate(uid!)}
                                                            >
                                                                Activate
                                                            </Button>
                                                        )
                                                    )}
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
        </div>
    );
}
