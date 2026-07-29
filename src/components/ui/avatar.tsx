"use client";

import { User } from "lucide-react";

import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
};

export function Avatar({
  src,
  name,
  size = "md",
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover border border-border",
          sizes[size]
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border border-border bg-muted font-semibold text-card-foreground",
        sizes[size]
      )}
    >
      {initials || <User size={20} />}
    </div>
  );
}