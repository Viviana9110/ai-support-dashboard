export type ToastType =
  | "success"
  | "error"
  | "info"
  | "warning";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
}