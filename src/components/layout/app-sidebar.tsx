'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        w-64
        border-r
        border-sidebar-border
        bg-sidebar
        text-sidebar-foreground
        transition-colors
        duration-300
      "
    >
      <div className="border-b border-sidebar-border p-6">
        <h2 className="text-xl font-bold tracking-tight">
          AI Support
        </h2>
      </div>

      <nav className="space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  transition-all
                  duration-200
                `,
                active
                  ? `
                      bg-sidebar-accent
                      text-sidebar-accent-foreground
                      shadow-sm
                    `
                  : `
                      text-muted-foreground
                      hover:bg-sidebar-accent
                      hover:text-sidebar-foreground
                    `
              )}
            >
              <Icon
                size={18}
                className={cn(
                  "transition-colors",
                  active
                    ? "text-primary"
                    : "group-hover:text-primary"
                )}
              />

              <span className="font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}