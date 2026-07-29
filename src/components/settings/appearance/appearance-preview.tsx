'use client';

import { Monitor, Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

interface AppearancePreviewProps {
  theme: 'light' | 'dark' | 'system';
  accent: 'blue' | 'emerald' | 'violet' | 'orange';
  compactMode: boolean;
}

const accentColors = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
};

export function AppearancePreview({
  theme,
  accent,
  compactMode,
}: AppearancePreviewProps) {
  const dark = theme === 'dark';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">
          Preview
        </h3>

        <p className="text-muted-foreground text-sm">
          Preview how your interface will look.
        </p>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-2xl border transition-all',
          dark
            ? 'border-zinc-700 bg-zinc-900'
            : 'border-zinc-200 bg-white',
        )}
      >
        {/* Header */}

        <div
          className={cn(
            'flex items-center justify-between border-b px-5',
            compactMode ? 'py-2' : 'py-4',
            dark
              ? 'border-zinc-700'
              : 'border-zinc-200',
          )}
        >
          <div>
            <h4
              className={cn(
                'font-semibold',
                dark
                  ? 'text-white'
                  : 'text-zinc-900',
              )}
            >
              Dashboard
            </h4>

            <p
              className={cn(
                'text-sm',
                dark
                  ? 'text-zinc-400'
                  : 'text-zinc-500',
              )}
            >
              Welcome back
            </p>
          </div>

          {theme === 'light' && <Sun size={18} />}

          {theme === 'dark' && <Moon size={18} />}

          {theme === 'system' && <Monitor size={18} />}
        </div>

        {/* Content */}

        <div
          className={cn(
            compactMode ? 'space-y-3 p-4' : 'space-y-5 p-6',
          )}
        >
          <div
            className={cn(
              'h-3 rounded-full',
              accentColors[accent],
            )}
            style={{ width: '70%' }}
          />

          <div
            className={cn(
              'h-3 rounded-full',
              dark
                ? 'bg-zinc-700'
                : 'bg-zinc-200',
            )}
            style={{ width: '100%' }}
          />

          <div
            className={cn(
              'h-3 rounded-full',
              dark
                ? 'bg-zinc-700'
                : 'bg-zinc-200',
            )}
            style={{ width: '80%' }}
          />

          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                compactMode
                  ? 'h-20'
                  : 'h-28',
                'rounded-xl',
                dark
                  ? 'bg-zinc-800'
                  : 'bg-zinc-100',
              )}
            />

            <div
              className={cn(
                compactMode
                  ? 'h-20'
                  : 'h-28',
                'rounded-xl',
                dark
                  ? 'bg-zinc-800'
                  : 'bg-zinc-100',
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}