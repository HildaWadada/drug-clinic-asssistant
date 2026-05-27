/**
 * Badge.tsx
 * Small label used for clinic types, categories, open/closed status.
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "green" | "gray" | "amber" | "purple";
  className?: string;
}

export function Badge({ label, variant = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        {
          "bg-brand-50 text-brand-800": variant === "green",
          "bg-gray-100 text-gray-600": variant === "gray",
          "bg-amber-50 text-amber-800": variant === "amber",
          "bg-purple-50 text-purple-800": variant === "purple",
        },
        className
      )}
    >
      {label}
    </span>
  );
}
