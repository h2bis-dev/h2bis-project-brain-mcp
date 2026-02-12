"use client";

import { useEffect, useCallback, useRef } from "react";

interface DraftData {
    data: any;
    timestamp: number;
    userId: string;
}

interface UseAutoSaveDraftOptions {
    formId: string;
    userId: string | undefined;
    data: any;
    autoSaveInterval?: number; // Milliseconds between auto-saves (default: 30s)
    expiryDays?: number; // Days before draft expires (default: 7)
}

/**
 * Hook to auto-save form data as drafts in localStorage
 * - Auto-saves every 30 seconds
 * - User-specific (clears on user switch)
 * - Auto-expires after 7 days
 */
export function useAutoSaveDraft({
    formId,
    userId,
    data,
    autoSaveInterval = 30 * 1000, // 30 seconds
    expiryDays = 7,
}: UseAutoSaveDraftOptions) {
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const storageKey = `draft_${userId}_${formId}`;

    // Save draft to localStorage
    const saveDraft = useCallback(() => {
        if (!userId || !data) return;

        const draftData: DraftData = {
            data,
            timestamp: Date.now(),
            userId,
        };

        try {
            localStorage.setItem(storageKey, JSON.stringify(draftData));
        } catch (error) {
            console.error("Failed to save draft:", error);
        }
    }, [userId, data, storageKey]);

    // Load draft from localStorage
    const loadDraft = useCallback((): any | null => {
        if (!userId) return null;

        try {
            const stored = localStorage.getItem(storageKey);
            if (!stored) return null;

            const draftData: DraftData = JSON.parse(stored);

            // Check if draft is for same user
            if (draftData.userId !== userId) {
                localStorage.removeItem(storageKey);
                return null;
            }

            // Check if draft has expired
            const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
            const isExpired = Date.now() - draftData.timestamp > expiryMs;

            if (isExpired) {
                localStorage.removeItem(storageKey);
                return null;
            }

            return draftData.data;
        } catch (error) {
            console.error("Failed to load draft:", error);
            return null;
        }
    }, [userId, storageKey, expiryDays]);

    // Clear draft from localStorage
    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error("Failed to clear draft:", error);
        }
    }, [storageKey]);

    // Auto-save on interval
    useEffect(() => {
        if (!userId || !data) return;

        saveTimerRef.current = setInterval(saveDraft, autoSaveInterval);

        return () => {
            if (saveTimerRef.current) clearInterval(saveTimerRef.current);
        };
    }, [userId, data, saveDraft, autoSaveInterval]);

    return {
        saveDraft,
        loadDraft,
        clearDraft,
    };
}
