'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation } from '@/constants/navigation';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white dark:bg-zinc-950">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">AI Support</h2>
      </div>

      <nav className="space-y-2 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                pathname === item.href
                  ? 'bg-black text-white'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
              )}
            >
              <Icon size={18} />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
