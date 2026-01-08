"use client";

import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-8">
                {/* Left side - could add search here */}
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        H2BIS ProjectBrain
                    </div>
                </div>

                {/* Right side - actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
