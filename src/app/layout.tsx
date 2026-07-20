import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';

import { ThemeProvider } from '@/providers/theme-provider';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QueryProvider } from '@/providers/query-provider';
import { ToastProvider } from "@/providers/toast-provider";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'AI Support Dashboard',
  description: 'Support dashboard powered by AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans', geist.variable)}
    >
      <body>
        <ToastProvider>
          <ThemeProvider>
          <TooltipProvider>
            <QueryProvider>{children}</QueryProvider>
          </TooltipProvider>
        </ThemeProvider>
        </ToastProvider>
        
      </body>
    </html>
  );
}
