import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics & AI</h1>
                <p className="text-muted-foreground mt-2">
                    AI-powered insights and analysis
                </p>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Analytics dashboard coming soon...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
