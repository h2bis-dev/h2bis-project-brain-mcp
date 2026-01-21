"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import {
    LayoutDashboard,
    FileText,
    Network,
    Brain,
    BookText,
    Code,
} from "lucide-react";

const navigation = [
    {
        name: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        name: "Use Cases",
        href: ROUTES.USE_CASES,
        icon: FileText,
    },
    {
        name: "Capabilities",
        href: ROUTES.CAPABILITIES,
        icon: Network,
    },
    {
        name: "Analytics",
        href: ROUTES.ANALYTICS,
        icon: Brain,
    },
    {
        name: "Summaries",
        href: ROUTES.SUMMARIES,
        icon: BookText,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 flex-col border-r bg-card px-4 py-6">
            {/* Logo */}
            <div className="mb-8">
                <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Brain className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg">ProjectBrain</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Admin-only Develop tab */}
                <PermissionGuard permission="access:develop">
                    <Link
                        href="/develop"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            pathname === "/develop"
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <Code className="h-5 w-5" />
                        Develop
                    </Link>
                </PermissionGuard>
            </nav>
        </aside>
    );
}
