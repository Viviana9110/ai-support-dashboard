'use client';

import {
  Download,
  Power,
  Trash2,
} from 'lucide-react';

import { Card } from '@/components/ui/card';

import { DangerAction } from './danger-action';

import { useToast } from '@/hooks/use-toast';

export function DangerZoneCard() {
  const toast = useToast();

  return (
    <Card className="border-destructive/20 p-6">
      <div className="mb-8">
        <h2 className="text-destructive text-xl font-semibold">
          Danger Zone
        </h2>

        <p className="text-muted-foreground mt-1 text-sm">
          These actions affect your account and some cannot be undone.
        </p>
      </div>

      <div className="space-y-4">
        <DangerAction
          icon={<Download size={20} />}
          title="Export Account Data"
          description="Download all your personal data."
          buttonLabel="Export"
          onClick={() =>
            toast.success(
              'Export started',
              'Your data export has been queued.',
            )
          }
        />

        <DangerAction
          icon={<Power size={20} />}
          title="Deactivate Account"
          description="Your account will be disabled until you sign in again."
          buttonLabel="Deactivate"
          onClick={() =>
            toast.warning(
              'Account deactivated',
              'Your account has been temporarily disabled.',
            )
          }
        />

        <DangerAction
          icon={<Trash2 size={20} />}
          title="Delete Account"
          description="This permanently deletes your account."
          buttonLabel="Delete"
          buttonVariant="destructive"
          onClick={() =>
            toast.error(
              'Delete account',
              'This action requires confirmation.',
            )
          }
        />
      </div>
    </Card>
  );
}