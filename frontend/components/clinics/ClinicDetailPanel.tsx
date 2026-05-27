/**
 * ClinicDetailPanel.tsx
 * Shows full details for the selected clinic alongside the map.
 */

import { Phone, Clock, MapPin, Building2, Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatClinicType } from "@/lib/utils";
import type { Clinic } from "@/lib/types";

interface ClinicDetailPanelProps {
  clinic: Clinic;
}

interface DetailRowProps {
  icon: React.ReactNode;
  text: string;
}

function DetailRow({ icon, text }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2 text-sm text-gray-600">
      <span className="mt-0.5 flex-shrink-0 text-brand-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export function ClinicDetailPanel({ clinic }: ClinicDetailPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{clinic.name}</h2>
        <Badge
          label={formatClinicType(clinic.type)}
          variant={clinic.type === "public" ? "green" : "gray"}
        />
      </div>

      <div className="flex flex-col gap-2">
        <DetailRow icon={<MapPin className="h-4 w-4" />} text={clinic.address} />
        <DetailRow icon={<Clock className="h-4 w-4" />} text={clinic.hours} />
        <DetailRow icon={<Phone className="h-4 w-4" />} text={clinic.phone} />
        <DetailRow
          icon={<Building2 className="h-4 w-4" />}
          text={clinic.services.join(", ")}
        />
        {clinic.notes && (
          <DetailRow icon={<Info className="h-4 w-4" />} text={clinic.notes} />
        )}
      </div>
    </div>
  );
}
