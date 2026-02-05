import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { authService } from '@/services/auth.service';
import type { RegisterRequest, LoginRequest } from '@/types/auth.types';

/**
 * Hook for user registration
 * Handles loading, error states, and navigation automatically
 */
export function useRegister() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
        onSuccess: () => {
            // Invalidate auth-related queries
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            // Navigate to login page
            router.push('/login?registered=true');
        },
    });
}

/**
 * Hook for user login with credentials
 * Handles NextAuth integration, loading, and error states
 */
export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const result = await signIn('credentials', {
                username: data.email, // NextAuth expects 'username' field
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Invalid email or password');
            }

            return result;
        },
        onSuccess: () => {
            // Invalidate user/auth queries to refetch fresh data
            queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
            // Navigate to dashboard
            router.push('/projects');
            router.refresh();
        }
    });
}

/**
 * Hook for Google OAuth sign-in
 * Handles loading state for Google authentication
 */
export function useGoogleLogin() {
    return useMutation({
        mutationFn: async () => {
            await signIn('google', { callbackUrl: '/dashboard' });
        },
        onError: (error) => {
            console.error('Google sign-in error:', error);
        },
    });
}
