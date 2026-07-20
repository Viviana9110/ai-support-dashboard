"use client";

import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

import { Toast } from "@/types/toast.types";

interface ToastItemProps {
  toast: Toast;
  onClose: (id: number) => void;
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
};

export function ToastItem({
  toast,
  onClose,
}: ToastItemProps) {
  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        x: 100,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: 100,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex w-96 items-start gap-3 rounded-xl border bg-white p-4 shadow-xl"
    >
      <div>{icons[toast.type]}</div>

      <div className="flex-1">
        <h4 className="font-semibold">
          {toast.title}
        </h4>

        {toast.description && (
          <p className="mt-1 text-sm text-gray-500">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="rounded p-1 hover:bg-gray-100"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}