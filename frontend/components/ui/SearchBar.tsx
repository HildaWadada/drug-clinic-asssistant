"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3", className)}>
      <Search className="h-4 w-4 flex-shrink-0 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
