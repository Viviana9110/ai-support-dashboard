'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { PasswordSettings } from './password-settings';

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Security
        </CardTitle>
      </CardHeader>

      <CardContent>
        <PasswordSettings />
      </CardContent>
    </Card>
  );
}