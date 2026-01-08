import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummariesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Summaries</h1>
                <p className="text-muted-foreground mt-2">
                    AI-generated project summaries and insights
                </p>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Summary List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No summaries available yet...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
