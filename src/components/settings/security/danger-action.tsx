'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface DangerActionProps {
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant?: 'outline' | 'destructive';
  icon?: ReactNode;
  onClick: () => void;
}

export function DangerAction({
  title,
  description,
  buttonLabel,
  buttonVariant = 'outline',
  icon,
  onClick,
}: DangerActionProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-5">
      <div className="flex items-start gap-4">
        {icon && (
          <div className="bg-destructive/10 text-destructive rounded-xl p-3">
            {icon}
          </div>
        )}

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="text-muted-foreground mt-1 text-sm">
            {description}
          </p>
        </div>
      </div>

      <Button
        variant={buttonVariant}
        onClick={onClick}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}