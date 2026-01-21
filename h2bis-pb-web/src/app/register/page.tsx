'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegister } from '@/hooks/useAuth';
import type { RegisterRequest } from '@/types/auth.types';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user' as 'user' | 'admin', // Default to user role
    });

    const registerMutation = useRegister();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            // Reset any previous errors and return
            registerMutation.reset();
            return;
        }

        const userData: RegisterRequest = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            role: [formData.role], // API expects array of roles
        };

        registerMutation.mutate(userData);
    };

    // Check for password mismatch
    const passwordMismatch = !!(formData.password && formData.confirmPassword &&
        formData.password !== formData.confirmPassword);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                        Enter your information to create a new account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={registerMutation.isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={registerMutation.isPending}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                required
                                disabled={registerMutation.isPending}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <p className="text-xs text-gray-500">
                                Select the role for this account
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={registerMutation.isPending}
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={registerMutation.isPending}
                                minLength={6}
                            />
                        </div>

                        {/* Show password mismatch error */}
                        {passwordMismatch && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                Passwords don't match
                            </div>
                        )}

                        {/* Show API error */}
                        {registerMutation.isError && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                {registerMutation.error.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={registerMutation.isPending || passwordMismatch}
                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                        </button>

                        <div className="text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
