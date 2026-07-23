import { useToastStore } from "@/store/toast.store";

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (
      title: string,
      description?: string,
      duration?: number
    ) =>
      addToast(title, "success", description, duration),

    error: (
      title: string,
      description?: string,
      duration?: number
    ) =>
      addToast(title, "error", description, duration),

    info: (
      title: string,
      description?: string,
      duration?: number
    ) =>
      addToast(title, "info", description, duration),

    warning: (
      title: string,
      description?: string,
      duration?: number
    ) =>
      addToast(title, "warning", description, duration),
  };
}