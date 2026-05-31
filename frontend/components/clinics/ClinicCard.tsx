import { MapPin, Clock } from "lucide-react";
import { cn, formatClinicType } from "@/lib/utils";
import type { Clinic } from "@/lib/types";

interface ClinicCardProps {
  clinic: Clinic;
  isSelected: boolean;
  onClick: () => void;
}

export function ClinicCard({ clinic, isSelected, onClick }: ClinicCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        isSelected
          ? "border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/20"
          : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn(
          "text-sm font-medium",
          isSelected ? "text-brand-900 dark:text-brand-300" : "text-gray-900 dark:text-slate-100"
        )}>
          {clinic.name}
        </p>
        <span className={cn(
          "flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          clinic.is_open_24h
            ? "text-brand-500 font-semibold"
            : "text-gray-400 dark:text-slate-500"
        )}>
          {clinic.is_open_24h ? "24h" : "Check hours"}
        </span>
      </div>

      <div className="mt-1 flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
          <MapPin className="h-3 w-3" />{clinic.address}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
          <Clock className="h-3 w-3" />{clinic.hours}
        </span>
      </div>

      <div className="mt-1.5">
        <span className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          clinic.type === "public"
            ? "text-brand-500 font-medium"
            : "text-gray-400 dark:text-slate-400"
        )}>
          {formatClinicType(clinic.type)}
        </span>
      </div>
    </button>
  );
}
