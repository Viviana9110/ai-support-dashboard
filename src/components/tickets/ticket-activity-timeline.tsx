'use client';

import { History } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { TicketActivity } from '@/services/ticket.types';

interface TicketActivityTimelineProps {
  activity: TicketActivity[];
}

export function TicketActivityTimeline({
  activity,
}: TicketActivityTimelineProps) {
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
              Changes to this ticket will appear here.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-6 border-l border-border pl-6">
            {activity.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[31px] mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />

                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium">{entry.action}</p>

                  <time className="text-muted-foreground shrink-0 text-xs">
                    {entry.createdAt}
                  </time>
                </div>

                {entry.user && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    by {entry.user}
                  </p>
                )}

                {entry.metadata && (
                  <pre className="bg-muted/50 text-muted-foreground mt-2 whitespace-pre-wrap rounded-lg p-3 text-xs">
                    {JSON.stringify(entry.metadata, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
