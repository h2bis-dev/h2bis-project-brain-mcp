import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
    title: "H2BIS ProjectBrain",
    description: "AI-powered project knowledge management system",
};

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
