import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthLayout({
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-xl font-bold text-foreground">
            AI Support Dashboard
          </h1>

          <p className="text-sm font-medium text-foreground">{title}</p>

          <p className="text-xs text-muted-foreground">{description}</p>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
