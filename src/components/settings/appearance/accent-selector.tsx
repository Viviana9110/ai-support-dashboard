'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AccentColor =
  | 'blue'
  | 'emerald'
  | 'violet'
  | 'orange';

interface AccentSelectorProps {
  value: AccentColor;
  onChange: (color: AccentColor) => void;
}

const colors = [
  {
    value: 'blue' as const,
    label: 'Blue',
    className: 'bg-blue-500',
  },
  {
    value: 'emerald' as const,
    label: 'Emerald',
    className: 'bg-emerald-500',
  },
  {
    value: 'violet' as const,
    label: 'Violet',
    className: 'bg-violet-500',
  },
  {
    value: 'orange' as const,
    label: 'Orange',
    className: 'bg-orange-500',
  },
];

export function AccentSelector({
  value,
  onChange,
}: AccentSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">
          Accent Color
        </h3>

        <p className="text-muted-foreground text-sm">
          Personalize the primary color of the application.
        </p>
      </div>

      <div className="flex gap-4">
        {colors.map((color) => {
          const selected = value === color.value;

          return (
            <button
              key={color.value}
              type="button"
              onClick={() => onChange(color.value)}
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                color.className,
                selected &&
                  'ring-primary scale-110 ring-4'
              )}
            >
              {selected && (
                <Check
                  size={20}
                  className="text-white"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}