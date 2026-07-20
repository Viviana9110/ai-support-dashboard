import { ReactNode } from 'react';

import { AppHeader } from '@/components/layout/app-header/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 bg-zinc-50 p-8">{children}</main>
      </div>
    </div>
  );
}
