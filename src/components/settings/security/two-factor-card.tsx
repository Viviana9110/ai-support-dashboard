'use client';

import { ShieldCheck } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface Props {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function TwoFactorCard({
  enabled,
  onChange,
}: Props) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="bg-primary/10 text-primary rounded-xl p-3">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              Two-Factor Authentication
            </h3>

            <p className="text-muted-foreground mt-1 text-sm">
              Add an extra layer of protection to your account.
            </p>
          </div>
        </div>

        <Switch
          checked={enabled}
          onCheckedChange={onChange}
        />
      </div>

      <div className="mt-6 rounded-xl border bg-muted/40 p-4">
        <p className="text-sm">
          {enabled
            ? 'Two-factor authentication is enabled.'
            : 'Two-factor authentication is disabled.'}
        </p>

        {enabled && (
          <Button
            variant="outline"
            className="mt-4"
          >
            Configure Authenticator
          </Button>
        )}
      </div>
    </Card>
  );
}