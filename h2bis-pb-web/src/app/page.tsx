import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, Network, Brain, ArrowRight } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        H2BIS ProjectBrain
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        AI-powered project knowledge management system for modern development teams
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="gap-2">
                                Go to Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/use-cases">
                            <Button size="lg" variant="outline">
                                Browse Use Cases
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <FileText className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Use Cases</CardTitle>
                            <CardDescription>
                                Manage and analyze project use cases with AI-powered insights
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Network className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Capability Graph</CardTitle>
                            <CardDescription>
                                Visualize dependencies and analyze implementation impact
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Brain className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>AI Analytics</CardTitle>
                            <CardDescription>
                                Chat with AI to analyze risks, suggest strategies, and more
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <Database className="h-10 w-10 text-primary mb-2" />
                            <CardTitle>Knowledge Base</CardTitle>
                            <CardDescription>
                                Centralized repository for all project knowledge and insights
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* Stats Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Overview</CardTitle>
                        <CardDescription>
                            Project Brain is connected and ready
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-primary">API</div>
                                <div className="text-sm text-muted-foreground mt-1">Backend Ready</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">MCP</div>
                                <div className="text-sm text-muted-foreground mt-1">AI Integration</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary">MongoDB</div>
                                <div className="text-sm text-muted-foreground mt-1">Database Active</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
