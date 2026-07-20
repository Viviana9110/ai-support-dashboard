"use client";

import { AnimatePresence } from "framer-motion";

import { ToastItem } from "./toast-item";

import { useToastStore } from "@/store/toast.store";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onClose={removeToast}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}