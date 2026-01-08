import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CapabilitiesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Capability Graph</h1>
                <p className="text-muted-foreground mt-2">
                    Visualize and analyze capability dependencies
                </p>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Graph Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Capability graph visualization coming soon...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
