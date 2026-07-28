import { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <AppHeader />

        <main className="flex-1 bg-background p-8 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}