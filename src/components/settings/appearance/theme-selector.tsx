'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeSelectorProps {
  value: ThemeOption;
  onChange: (theme: ThemeOption) => void;
}

const themes = [
  {
    value: 'light' as const,
    label: 'Light',
    description: 'Always use the light theme.',
    icon: Sun,
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    description: 'Always use the dark theme.',
    icon: Moon,
  },
  {
    value: 'system' as const,
    label: 'System',
    description: 'Follow your operating system.',
    icon: Monitor,
  },
];

export function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-4">

      <div>
        <h3 className="text-base font-semibold">
          Theme
        </h3>

        <p className="text-muted-foreground text-sm">
          Choose how the interface should look.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {themes.map((theme) => {
          const Icon = theme.icon;

          const selected = value === theme.value;

          return (
            <button
              key={theme.value}
              type="button"
              onClick={() => onChange(theme.value)}
              className={cn(
                "rounded-2xl border p-5 text-left transition-all",
                "hover:border-primary hover:shadow-md",
                selected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card"
              )}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Icon size={22} />
              </div>

              <h4 className="font-semibold">
                {theme.label}
              </h4>

              <p className="text-muted-foreground mt-1 text-sm">
                {theme.description}
              </p>
            </button>
          );
        })}
      </div>

    </div>
  );
}