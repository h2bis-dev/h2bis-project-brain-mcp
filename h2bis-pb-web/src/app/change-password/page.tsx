'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/hooks/useAuth';

/**
 * First-login change-password page.
 * Shown automatically when the session has mustChangePassword = true.
 * On success the user is signed out and redirected to /login to re-authenticate
 * with their new password.
 */
export default function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const changePasswordMutation = useChangePassword();

    const passwordMismatch =
        newPassword.length > 0 &&
        confirmPassword.length > 0 &&
        newPassword !== confirmPassword;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordMismatch) return;

        changePasswordMutation.mutate({ currentPassword, newPassword });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Set Your Password
                    </CardTitle>
                    <CardDescription>
                        Your account requires a password change before you can continue.
                        Enter the one-time password you received, then choose a new password.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {changePasswordMutation.isError && (
                        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-center border border-destructive/20">
                            {(changePasswordMutation.error as Error)?.message ??
                                'Failed to change password. Please try again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">One-Time Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                placeholder="Enter the one-time password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                disabled={changePasswordMutation.isPending}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Choose a new password (min 8 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={changePasswordMutation.isPending}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Repeat your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                disabled={changePasswordMutation.isPending}
                                className="h-11"
                            />
                        </div>

                        {passwordMismatch && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                                Passwords do not match.
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium"
                            disabled={changePasswordMutation.isPending || passwordMismatch}
                        >
                            {changePasswordMutation.isPending ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Set New Password'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
