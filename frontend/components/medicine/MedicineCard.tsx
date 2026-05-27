import { Pill, Clock, AlertCircle, MapPin } from "lucide-react";
import type { MedicineInfo } from "@/lib/types";

interface MedicineCardProps {
  medicine: MedicineInfo;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 bg-brand-50 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
          <Pill className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-brand-900">{medicine.name}</p>
          {medicine.drug_class && (
            <p className="text-xs text-brand-600">{medicine.drug_class}</p>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-2 p-4">
        {medicine.dosage && (
          <InfoField icon={<Pill className="h-3.5 w-3.5" />} label="Dosage" value={medicine.dosage} />
        )}
        {medicine.duration && (
          <InfoField icon={<Clock className="h-3.5 w-3.5" />} label="Duration" value={medicine.duration} />
        )}
        {medicine.side_effects && (
          <InfoField icon={<AlertCircle className="h-3.5 w-3.5" />} label="Side effects" value={medicine.side_effects} />
        )}
        {medicine.availability && (
          <InfoField icon={<MapPin className="h-3.5 w-3.5" />} label="Where to get it" value={medicine.availability} />
        )}
      </div>

      {medicine.warnings && (
        <div className="mx-4 mb-4 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
          ⚠ {medicine.warnings}
        </div>
      )}
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-gray-50 p-3">
      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-400">
        {icon}
        {label}
      </div>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}
