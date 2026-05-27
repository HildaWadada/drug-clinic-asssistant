import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-2 border-gray-200 border-t-brand-500",
        SIZE_MAP[size],
        className
      )}
    />
  );
}
