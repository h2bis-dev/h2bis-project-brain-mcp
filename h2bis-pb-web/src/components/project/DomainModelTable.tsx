'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { DomainEntity, DomainModelLayer } from '@/types/project.types';

// ── Layer badge colour map ────────────────────────────────────────────────────

const LAYER_VARIANT: Record<DomainModelLayer, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    data:     'default',
    dto:      'secondary',
    domain:   'default',
    response: 'outline',
    request:  'outline',
    event:    'secondary',
    other:    'outline',
};

const LAYER_LABEL: Record<DomainModelLayer, string> = {
    data:     'Data',
    dto:      'DTO',
    domain:   'Domain',
    response: 'Response',
    request:  'Request',
    event:    'Event',
    other:    'Other',
};

// ── Component ─────────────────────────────────────────────────────────────────

interface DomainModelTableProps {
    models: DomainEntity[] | undefined;
}

export function DomainModelTable({ models }: DomainModelTableProps) {
    if (!models || models.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                    No domain models yet. Use the <code>upsertProjectDomainModel</code> MCP tool
                    from your IDE agent to register models as you develop features.
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {models.map((model) => (
                <div key={model.name} className="border rounded-lg p-4 space-y-3">

                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-base truncate">{model.name}</h4>
                            {model.description && (
                                <p className="text-sm text-muted-foreground mt-0.5">{model.description}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {model.layer && (
                                <Badge variant={LAYER_VARIANT[model.layer]}>
                                    {LAYER_LABEL[model.layer]}
                                </Badge>
                            )}
                            <Badge variant="secondary">{model.fields.length} fields</Badge>
                            {model.usedByUseCases.length > 0 && (
                                <Badge variant="outline">{model.usedByUseCases.length} UC{model.usedByUseCases.length > 1 ? 's' : ''}</Badge>
                            )}
                        </div>
                    </div>

                    {/* Fields table */}
                    {model.fields.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="text-left text-muted-foreground border-b">
                                        <th className="pb-1 pr-3 font-medium">Field</th>
                                        <th className="pb-1 pr-3 font-medium">Type</th>
                                        <th className="pb-1 pr-3 font-medium">Req</th>
                                        <th className="pb-1 pr-3 font-medium">Default</th>
                                        <th className="pb-1 font-medium">Constraints</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {model.fields.map((field) => (
                                        <tr key={field.name} className="border-b border-border/40 last:border-0">
                                            <td className="py-1 pr-3 font-mono font-medium">{field.name}</td>
                                            <td className="py-1 pr-3 font-mono text-blue-600 dark:text-blue-400">{field.type}</td>
                                            <td className="py-1 pr-3">
                                                {field.required
                                                    ? <span className="text-amber-600 font-semibold">Yes</span>
                                                    : <span className="text-muted-foreground">No</span>
                                                }
                                            </td>
                                            <td className="py-1 pr-3 font-mono text-muted-foreground">
                                                {field.defaultValue ?? '—'}
                                            </td>
                                            <td className="py-1">
                                                {field.constraints.length > 0
                                                    ? field.constraints.map((c) => (
                                                        <Badge key={c} variant="outline" className="mr-1 text-[10px] px-1 py-0">
                                                            {c}
                                                        </Badge>
                                                    ))
                                                    : <span className="text-muted-foreground">—</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                        {model.addedBy && (
                            <span>Added by <span className="font-medium">{model.addedBy}</span></span>
                        )}
                        {model.updatedAt && (
                            <span>Updated {new Date(model.updatedAt).toLocaleDateString()}</span>
                        )}
                        {model.usedByUseCases.length > 0 && (
                            <span title={model.usedByUseCases.join(', ')}>
                                Used by {model.usedByUseCases.length} use case{model.usedByUseCases.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
