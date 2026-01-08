import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function UseCasesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Use Cases</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage and analyze project use cases
                    </p>
                </div>
                <Link href={ROUTES.USE_CASE_NEW}>
                    <Button>
                        <Plus className="h-4 w-4" />
                        Create Use Case
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>Use Case List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No use cases found. Create your first use case to get started.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
