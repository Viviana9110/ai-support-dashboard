'use client';

import { History } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { TicketActivity } from '@/services/ticket.types';

interface CustomerActivityTimelineProps {
  activity: TicketActivity[];
}

function formatField(field: string): string {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

function actionLabel(entry: TicketActivity): string {
  switch (entry.action) {
    case 'created':
      return 'Customer created';

    case 'deleted':
      return 'Customer deleted';

    case 'restored':
      return 'Customer restored';

    case 'updated':
      if (
        entry.metadata &&
        typeof entry.metadata.field === 'string'
      ) {
        return `${formatField(entry.metadata.field)} changed`;
      }

      return 'Customer updated';

    default:
      return entry.action;
  }
}

export function CustomerActivityTimeline({
  activity,
}: CustomerActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      <CardContent>
        {activity.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <History size={22} className="text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">No activity yet</p>

            <p className="text-muted-foreground mt-1 text-sm">
              Changes to this customer will appear here.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-6 border-l border-border pl-6">
            {activity.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[31px] mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{actionLabel(entry)}</p>

                  <time className="text-muted-foreground shrink-0 text-xs">
                    {entry.createdAt}
                  </time>
                </div>

                {entry.user && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    by {entry.user}
                  </p>
                )}

                {entry.action === 'updated' && entry.metadata && (
                  <div className="bg-muted/50 text-muted-foreground mt-2 inline-flex flex-col gap-1 rounded-lg px-3 py-2 text-sm">
                    <span>{String(entry.metadata.before ?? '')}</span>

                    <span>↓</span>

                    <span className="font-medium text-card-foreground">
                      {String(entry.metadata.after ?? '')}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
