'use client';

import {
  Monitor,
  Smartphone,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Session } from './sessions';

interface SessionItemProps {
  session: Session;
  onSignOut: (id: number) => void;
}

export function SessionItem({
  session,
  onSignOut,
}: SessionItemProps) {
  const isMobile =
    session.device.toLowerCase().includes('iphone') ||
    session.device.toLowerCase().includes('android');

  return (
    <div className="flex items-start justify-between rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40">
      <div className="flex gap-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          {isMobile ? (
            <Smartphone size={22} />
          ) : (
            <Monitor size={22} />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">
              {session.browser}
            </h3>

            <span className="text-muted-foreground">
              •
            </span>

            <span className="text-muted-foreground">
              {session.device}
            </span>

            {session.current && (
              <Badge variant="success">
                Current Device
              </Badge>
            )}
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <MapPin size={15} />

            {session.location}
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Clock size={15} />

            Last active {session.lastActive}
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <ShieldCheck size={15} />

            {session.ip}
          </div>
        </div>
      </div>

      {!session.current && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSignOut(session.id)}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
}