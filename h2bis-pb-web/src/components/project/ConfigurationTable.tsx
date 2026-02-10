'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import type { EnvironmentVariable, FeatureFlag } from '@/types/project.types';

interface ConfigurationTableProps {
    items: EnvironmentVariable[] | FeatureFlag[] | undefined;
    type: 'envVar' | 'flag';
}

export function ConfigurationTable({ items, type }: ConfigurationTableProps) {
    if (!items || items.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                    No {type === 'envVar' ? 'environment variables' : 'feature flags'} defined yet.
                </p>
            </Card>
        );
    }

    const isEnvVar = (item: EnvironmentVariable | FeatureFlag): item is EnvironmentVariable => {
        return 'defaultValue' in item && typeof item.defaultValue === 'string';
    };

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <div key={item.name} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-mono font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.description || 'No description'}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            {type === 'envVar' && isEnvVar(item) ? (
                                <>
                                    {item.required ? (
                                        <Badge variant="destructive" className="gap-1">
                                            <Check className="h-3 w-3" /> Required
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1">
                                            Optional
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <Badge variant={!isEnvVar(item) && item.defaultValue ? 'default' : 'secondary'}>
                                    {!isEnvVar(item) ? (item.defaultValue ? 'ON' : 'OFF') : '-'}
                                </Badge>
                            )}
                            <Badge variant="outline">{item.usedByUseCases.length} UCs</Badge>
                        </div>
                    </div>
                    {type === 'envVar' && isEnvVar(item) && item.defaultValue && (
                        <div className="text-xs font-mono text-muted-foreground">
                            Default: {item.defaultValue}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
