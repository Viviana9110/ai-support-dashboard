'use client';

import { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function NotificationGroup({
  title,
  description,
  children,
}: Props) {
  return (
    <div className="space-y-5">

      <div>
        <h3 className="text-base font-semibold">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  );
}