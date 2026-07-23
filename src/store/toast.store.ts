import { create } from "zustand";

import { Toast, ToastType } from "@/types/toast.types";

interface ToastStore {
  toasts: Toast[];

  addToast: (
    title: string,
    type: ToastType,
    description?: string,
    duration?: number
  ) => void;

  removeToast: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (title, type, description, duration = 4000) => {
    const id = Date.now();

    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          title,
          description,
          type,
          duration
        },
      ],
    }));

   
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));