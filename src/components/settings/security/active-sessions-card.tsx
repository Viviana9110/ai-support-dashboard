'use client';

import { useState } from 'react';
import { Laptop } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';

import { SessionItem } from './session-item';
import { sessions as initialSessions } from './sessions';

import { useToast } from '@/hooks/use-toast';

export function ActiveSessionsCard() {
  const [sessions, setSessions] = useState(initialSessions);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toast = useToast();

  function handleSignOut(id: number) {
    setSessions((previous) =>
      previous.filter((session) => session.id !== id),
    );

    toast.success(
      'Session closed',
      'The selected device has been signed out.',
    );
  }

  function handleSignOutAll() {
    setSessions((previous) =>
      previous.filter((session) => session.current),
    );

    toast.success(
      'Sessions closed',
      'All other devices have been signed out.',
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Active Sessions
            </h2>

            <p className="text-muted-foreground mt-1 text-sm">
              Manage devices currently logged into your account.
            </p>
          </div>

          {sessions.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
            >
              Sign Out All Devices
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon={Laptop}
            title="No active sessions"
            description="There are currently no active devices."
          />
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                onSignOut={handleSignOut}
              />
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={confirmOpen}
        title="Sign Out All Devices"
        onClose={() => setConfirmOpen(false)}
      >
        <div className="space-y-6">
          <p className="text-muted-foreground">
            This will sign out all devices except the current one.
          </p>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                handleSignOutAll();
                setConfirmOpen(false);
              }}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}