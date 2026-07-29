'use client';

import { CalendarDays, CalendarRange, Ban } from 'lucide-react';

import { cn } from '@/lib/utils';

export type DigestOption =
  | 'never'
  | 'daily'
  | 'weekly';

interface DigestSelectorProps {
  value: DigestOption;
  onChange: (value: DigestOption) => void;
}

const options = [
  {
    value: 'never' as const,
    label: 'Never',
    description: 'Do not receive summary emails.',
    icon: Ban,
  },
  {
    value: 'daily' as const,
    label: 'Daily',
    description: 'Receive one summary every day.',
    icon: CalendarDays,
  },
  {
    value: 'weekly' as const,
    label: 'Weekly',
    description: 'Receive one summary every week.',
    icon: CalendarRange,
  },
];

export function DigestSelector({
  value,
  onChange,
}: DigestSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {options.map((option) => {
        const Icon = option.icon;

        const selected =
          value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange(option.value)
            }
            className={cn(
              'rounded-2xl border p-5 text-left transition-all',
              'hover:border-primary hover:shadow-md',
              selected
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                : 'border-border bg-card',
            )}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <Icon size={22} />
            </div>

            <h4 className="font-semibold">
              {option.label}
            </h4>

            <p className="text-muted-foreground mt-1 text-sm">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}