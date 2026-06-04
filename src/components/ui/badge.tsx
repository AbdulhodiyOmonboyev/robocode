import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
    info: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    neutral: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
