'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PasswordSettings } from './password-settings';
import { useState } from 'react';
import { TwoFactorCard } from './two-factor-card';
import { ActiveSessionsCard } from './active-sessions-card';
import { DangerZoneCard } from './danger-zone-card';

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>

      <CardContent>
        <PasswordSettings />
      </CardContent>
      <div className="mt-8">
        <TwoFactorCard
          enabled={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
        />
        <div className="mt-8">
          <ActiveSessionsCard />
        </div>
        <div className="mt-8">
          <DangerZoneCard />
        </div>
      </div>
    </Card>
  );
}
