/**
 * ClinicCard.tsx
 * A single clinic entry in the list panel.
 * Highlights when selected.
 */

import { MapPin, Clock } from "lucide-react";
import { cn, formatClinicType } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
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
          ? "border-brand-300 bg-brand-50"
          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-sm font-medium", isSelected ? "text-brand-900" : "text-gray-900")}>
          {clinic.name}
        </p>
        <Badge
          label={clinic.is_open_24h ? "24h" : "Check hours"}
          variant={clinic.is_open_24h ? "green" : "gray"}
        />
      </div>

      <div className="mt-1 flex flex-col gap-0.5">
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {clinic.address}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          {clinic.hours}
        </span>
      </div>

      <div className="mt-1.5">
        <Badge
          label={formatClinicType(clinic.type)}
          variant={clinic.type === "public" ? "green" : clinic.type === "private" ? "gray" : "purple"}
        />
      </div>
    </button>
  );
}
