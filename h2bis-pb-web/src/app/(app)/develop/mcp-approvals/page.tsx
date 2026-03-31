'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { userService } from '@/services/user.service';
import { useToast } from '@/hooks/use-toast';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { User } from '@/types/auth.types';

export default function McpApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const loadPendingUsers = async () => {
    setLoading(true);
    try {
      const pending = await userService.getPendingUsers();
      setUsers(pending.map((u) => ({ ...u, id: (u as any)._id || u.id || '' } as User)));
    } catch (err) {
      toast({ title: 'Unable to load pending approvals', description: (err as Error).message || 'Try again', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    setActionId(userId);
    try {
      await userService.approveUser(userId);
      toast({ title: 'User approved', description: 'The user can now use MCP.', variant: 'default' });
      await loadPendingUsers();
    } catch (err) {
      toast({ title: 'Approval failed', description: (err as Error).message || 'Try again', variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setActionId(userId);
    try {
      await userService.deactivateUser(userId);
      toast({ title: 'User rejected', description: 'The user account has been deactivated.', variant: 'destructive' });
      await loadPendingUsers();
    } catch (err) {
      toast({ title: 'Rejection failed', description: (err as Error).message || 'Try again', variant: 'destructive' });
    } finally {
      setActionId(null);
    }
  };

  return (
    <PermissionGuard permission="access:develop">
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">MCP Access Requests</h1>
          <p className="text-muted-foreground mt-1">Approve or reject pending users before they can use MCP tools.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending MCP Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests at the moment.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-left">
                  <thead className="border-b">
                    <tr>
                      <th className="py-2 text-xs uppercase text-muted-foreground">Email</th>
                      <th className="py-2 text-xs uppercase text-muted-foreground">Name</th>
                      <th className="py-2 text-xs uppercase text-muted-foreground">Role</th>
                      <th className="py-2 text-xs uppercase text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0">
                        <td className="py-2 text-sm">{user.email}</td>
                        <td className="py-2 text-sm">{user.name || '—'}</td>
                        <td className="py-2 text-sm">{(user.role || []).join(', ')}</td>
                        <td className="py-2 text-sm space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            disabled={actionId === user.id}
                            onClick={() => handleApprove(user.id)}
                          >
                            {actionId === user.id ? '...' : 'Approve'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionId === user.id}
                            onClick={() => handleReject(user.id)}
                          >
                            {actionId === user.id ? '...' : 'Reject'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
}
