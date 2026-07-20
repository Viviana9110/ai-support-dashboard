"use client";

import { ToastContainer } from "@/components/ui/toast-container";

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({
  children,
}: ToastProviderProps) {
  return (
    <>
      {children}

      <ToastContainer />
    </>
  );
}