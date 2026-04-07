import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import type { LoginRequest, AdminCreateUserRequest, ChangePasswordRequest } from '@/types/auth.types';

/**
 * Hook for admin creating a new user.
 * Returns { mutate, data (tempPassword visible on success), isPending, isError, error }.
 */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AdminCreateUserRequest) => userService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/**
 * Hook for permanently deleting a user.
 * The caller is responsible for signing out if the deleted user is the current session user.
 */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => userService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/**
 * Hook for user login with credentials.
 */
export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const { signIn } = await import('next-auth/react');
            const result = await signIn('credentials', {
                username: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Invalid email or password');
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
            router.push('/dashboard');
            router.refresh();
        },
    });
}

/**
 * Hook for changing password on first login (or regular password change).
 * On success, signs the user out so they log in fresh with the new password.
 */
export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => authService.changePassword(data),
        onSuccess: async () => {
            await signOut({ callbackUrl: '/login?passwordChanged=true' });
        },
    });
}
