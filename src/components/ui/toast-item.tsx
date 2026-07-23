"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

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

const variants = {
  success: {
    container: "border-green-200 bg-green-50",
    title: "text-green-900",
    description: "text-green-700",
    progress: "bg-green-500",
  },
  error: {
    container: "border-red-200 bg-red-50",
    title: "text-red-900",
    description: "text-red-700",
    progress: "bg-red-500",
  },
  info: {
    container: "border-blue-200 bg-blue-50",
    title: "text-blue-900",
    description: "text-blue-700",
    progress: "bg-blue-500",
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50",
    title: "text-yellow-900",
    description: "text-yellow-700",
    progress: "bg-yellow-500",
  },
};

export function ToastItem({
  toast,
  onClose,
}: ToastItemProps) {
  const variant = variants[toast.type];

  const controls = useAnimationControls();

  const [remaining, setRemaining] = useState(toast.duration);
  const [paused, setPaused] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  // Maneja el cierre automático
  useEffect(() => {
    if (paused) return;

    startTime.current = Date.now();

    timeoutRef.current = setTimeout(() => {
      onClose(toast.id);
    }, remaining);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [paused, remaining, onClose, toast.id]);

  // Maneja la barra de progreso
  useEffect(() => {
    if (paused) {
      controls.stop();
      return;
    }

    controls.start({
      scaleX: 0,
      transition: {
        duration: remaining / 1000,
        ease: "linear",
      },
    });
  }, [paused, remaining, controls]);

  function handleMouseEnter() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const elapsed = Date.now() - startTime.current;

    setRemaining((previous) => Math.max(previous - elapsed, 0));

    setPaused(true);
  }

  function handleMouseLeave() {
    setPaused(false);
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        x: 100,
      }}
      transition={{
        duration: 0.25,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative
        flex
        w-96
        items-start
        gap-4
        overflow-hidden
        rounded-2xl
        border
        p-4
        shadow-xl
        ${variant.container}
      `}
    >
      <div>{icons[toast.type]}</div>

      <div className="flex-1">
        <h4 className={`font-semibold ${variant.title}`}>
          {toast.title}
        </h4>

        {toast.description && (
          <p className={`mt-1 text-sm ${variant.description}`}>
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="rounded-lg p-1 transition hover:bg-black/5"
      >
        <X size={16} />
      </button>

      <motion.div
        initial={{ scaleX: 1 }}
        animate={controls}
        className={`
          absolute
          bottom-0
          left-0
          h-1
          w-full
          origin-left
          ${variant.progress}
        `}
      />
    </motion.div>
  );
}