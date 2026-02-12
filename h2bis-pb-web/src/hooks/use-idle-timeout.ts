"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { signOut } from "next-auth/react";

interface UseIdleTimeoutOptions {
    idleTimeout?: number; // Milliseconds before logout (default: 15min)
    warningTime?: number; // Milliseconds before warning (default: 13min)
    onWarning?: () => void;
    onTimeout?: () => void;
}

/**
 * Hook to detect user idle timeout
 * Tracks user activity (mouse, keyboard, scroll, touch)
 * Shows warning before timeout and auto-logs out if idle
 */
export function useIdleTimeout({
    idleTimeout = 15 * 60 * 1000, // 15 minutes (aligned with access token TTL)
    warningTime = 13 * 60 * 1000, // 13 minutes (2-min warning before logout)
    onWarning,
    onTimeout,
}: UseIdleTimeoutOptions = {}) {
    const [showWarning, setShowWarning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef(Date.now());

    const clearTimers = useCallback(() => {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
    }, []);

    const startCountdown = useCallback(() => {
        const startTime = Date.now();
        const endTime = lastActivityRef.current + idleTimeout;

        countdownRef.current = setInterval(() => {
            const remaining = Math.max(0, endTime - Date.now());
            setTimeRemaining(Math.ceil(remaining / 1000));

            if (remaining <= 0) {
                if (countdownRef.current) clearInterval(countdownRef.current);
            }
        }, 1000);
    }, [idleTimeout]);

    const handleTimeout = useCallback(async () => {
        clearTimers();
        setShowWarning(false);
        onTimeout?.();
        // Auto logout
        await signOut({ callbackUrl: '/login?timeout=true' });
    }, [clearTimers, onTimeout]);

    const handleWarning = useCallback(() => {
        setShowWarning(true);
        startCountdown();
        onWarning?.();
    }, [onWarning, startCountdown]);

    const resetTimer = useCallback(() => {
        clearTimers();
        setShowWarning(false);
        lastActivityRef.current = Date.now();

        // Set warning timer
        warningTimerRef.current = setTimeout(handleWarning, warningTime);

        // Set timeout timer
        idleTimerRef.current = setTimeout(handleTimeout, idleTimeout);
    }, [clearTimers, handleWarning, handleTimeout, warningTime, idleTimeout]);

    const dismissWarning = useCallback(() => {
        setShowWarning(false);
        resetTimer();
    }, [resetTimer]);

    useEffect(() => {
        // Activity events to track
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'click',
        ];

        // Reset timer on any activity
        events.forEach((event) => {
            document.addEventListener(event, resetTimer);
        });

        // Start initial timer
        resetTimer();

        // Cleanup
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });
            clearTimers();
        };
    }, [resetTimer, clearTimers]);

    return {
        showWarning,
        timeRemaining,
        dismissWarning,
        resetTimer,
    };
}
