import { useToastStore } from "@/store/toast.store";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (title: string, description?: string) =>
      addToast(title, "success", description),

    error: (title: string, description?: string) =>
      addToast(title, "error", description),

    info: (title: string, description?: string) =>
      addToast(title, "info", description),

    warning: (title: string, description?: string) =>
      addToast(title, "warning", description),
  };
}