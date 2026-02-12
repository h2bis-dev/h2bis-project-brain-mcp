"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionWarningProps {
    open: boolean;
    timeRemaining: number;
    onDismiss: () => void;
}

/**
 * Session timeout warning dialog
 * Shows before automatic logout happens
 */
export function SessionWarning({ open, timeRemaining, onDismiss }: SessionWarningProps) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be logged out due to inactivity in{" "}
                        <span className="font-bold text-destructive">
                            {minutes > 0 ? `${minutes}m ` : ''}
                            {seconds}s
                        </span>
                        .
                        <br />
                        <br />
                        Click &quot;Stay Logged In&quot; to continue your session.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onDismiss}>
                        Stay Logged In
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
