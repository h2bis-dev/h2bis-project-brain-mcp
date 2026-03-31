"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { useProject } from "@/contexts/ProjectContext";
import {
    LayoutDashboard,
    FileText,
    Network,
    Brain,
    BookText,
    FolderKanban,
    Code,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const navigation = [
    {
        name: "Dashboard",
        href: ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        requiresProject: false,
    },
    {
        name: "Project",
        href: ROUTES.PROJECTS,
        icon: FolderKanban,
        requiresProject: true,
    },
    {
        name: "Use Cases",
        href: ROUTES.USE_CASES,
        icon: FileText,
        requiresProject: true,
    },
    {
        name: "Capabilities",
        href: ROUTES.CAPABILITIES,
        icon: Network,
        requiresProject: true,
    },
    {
        name: "Analytics",
        href: ROUTES.ANALYTICS,
        icon: Brain,
        requiresProject: true,
    },
    {
        name: "Summaries",
        href: ROUTES.SUMMARIES,
        icon: BookText,
        requiresProject: true,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { selectedProject } = useProject();

    return (
        <TooltipProvider delayDuration={0}>
            <aside
                className={cn(
                    "hidden md:flex flex-col border-r bg-card py-6 transition-all duration-300 ease-in-out relative",
                    isCollapsed ? "w-16 px-2" : "w-64 px-4"
                )}
            >
                {/* Logo */}
                <div className={cn("mb-8 transition-all duration-300", isCollapsed ? "mx-auto" : "")}>
                    <Link href={ROUTES.DASHBOARD} className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                            <Brain className="h-5 w-5 text-primary-foreground" />
                        </div>
                        {!isCollapsed && <span className="font-bold text-lg whitespace-nowrap">ProjectBrain</span>}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1">
                    {navigation.map((item) => {
                        const href = item.href;

                        const isActive = pathname === href || pathname?.startsWith(href + "/");
                        const shouldDisable = item.requiresProject && !selectedProject;

                        const linkContent = shouldDisable ? (
                            <div
                                key={item.name}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-not-allowed opacity-50",
                                    "text-muted-foreground",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                            </div>
                        ) : (
                            <Link
                                key={item.name}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                            </Link>
                        );

                        return isCollapsed ? (
                            <Tooltip key={item.name}>
                                <TooltipTrigger asChild>
                                    {linkContent}
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{item.name}{shouldDisable && " (Select a project)"}</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            linkContent
                        );
                    })}

                    {/* Admin-only Develop tab */}
                    <PermissionGuard permission="access:develop">
                        {(() => {
                            const isActive = pathname === "/develop";
                            const linkContent = (
                                <Link
                                    href="/develop"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <Code className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="whitespace-nowrap">Develop</span>}
                                </Link>
                            );

                            return isCollapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {linkContent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Develop</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                linkContent
                            );
                        })()}

                        {(() => {
                            const isActive = pathname === "/develop/mcp-approvals";
                            const linkContent = (
                                <Link
                                    href="/develop/mcp-approvals"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <Users className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="whitespace-nowrap">MCP Approvals</span>}
                                </Link>
                            );

                            return isCollapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {linkContent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>MCP Approvals</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                linkContent
                            );
                        })()}
                    </PermissionGuard>

                    {/* Admin-only Users management tab */}
                    <PermissionGuard permission="view:all-users">
                        {(() => {
                            const isActive = pathname === "/users" || pathname?.startsWith("/users/");
                            const linkContent = (
                                <Link
                                    href="/users"
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                        isCollapsed && "justify-center"
                                    )}
                                >
                                    <Users className="h-5 w-5 flex-shrink-0" />
                                    {!isCollapsed && <span className="whitespace-nowrap">Users</span>}
                                </Link>
                            );

                            return isCollapsed ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {linkContent}
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p>Users</p>
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                linkContent
                            );
                        })()}
                    </PermissionGuard>
                </nav>

                {/* Toggle Button */}
                <div className={cn("mt-4 pt-4 border-t", isCollapsed && "flex justify-center")}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="h-8 w-8"
                            >
                                {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                ) : (
                                    <ChevronLeft className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
}
