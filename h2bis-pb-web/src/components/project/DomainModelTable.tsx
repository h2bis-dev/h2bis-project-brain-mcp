'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { DomainEntity } from '@/types/project.types';

interface DomainModelTableProps {
    models: DomainEntity[] | undefined;
}

export function DomainModelTable({ models }: DomainModelTableProps) {
    if (!models || models.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                    No domain models found. Use the "Scan Codebase" button to discover models from your repository.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {models.map((model) => (
                <div key={model.name} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-lg">{model.name}</h4>
                            <p className="text-sm text-muted-foreground">{model.description || 'No description'}</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">{model.fields.length} fields</Badge>
                            <Badge variant="outline">{model.usedByUseCases.length} UCs</Badge>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                        📁 {model.modulePath}
                    </div>
                    {model.lastScanned && (
                        <div className="text-xs text-muted-foreground">
                            Last scanned: {new Date(model.lastScanned).toLocaleDateString()}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
