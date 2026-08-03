'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { DashboardActivity } from '@/services/dashboard.types';

interface RecentActivityProps {
  activity: DashboardActivity[];
}

const ACTION_LABELS: Record<string, string> = {
  created: 'Created',
  updated: 'Updated',
  status_changed: 'Status changed',
  priority_changed: 'Priority changed',
  customer_changed: 'Customer changed',
  agent_changed: 'Agent changed',
  deleted: 'Deleted',
  restored: 'Restored',
};

export function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <div className="bg-background rounded-xl border p-6">
      <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>

      {activity.length === 0 ? (
        <p className="text-muted-foreground text-sm">No activity yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {activity.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.user ?? 'Unknown'}</TableCell>

                <TableCell>{ACTION_LABELS[entry.action] ?? entry.action}</TableCell>

                <TableCell>{entry.entity}</TableCell>

                <TableCell className="text-muted-foreground">
                  {entry.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
