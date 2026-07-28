'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        size="icon"
        variant="ghost"
      >
        <Sun size={18} />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={() =>
        setTheme(isDark ? 'light' : 'dark')
      }
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </Button>
  );
}