/**
 * MedicineCard.tsx
 * Structured medicine info card that appears in chat when
 * a medicine name is detected in the AI response.
 * Fetches data from /api/medicine/{name} using useMedicine hook.
 */

"use client";

import { Pill } from "lucide-react";
import { useMedicine } from "@/hooks/useMedicine";
import { Spinner } from "@/components/ui/Spinner";

interface MedicineCardProps {
  medicineName: string;
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div className="rounded-md bg-gray-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm text-gray-800">{value}</p>
    </div>
  );
}

export function MedicineCard({ medicineName }: MedicineCardProps) {
  const { data, isLoading, error } = useMedicine(medicineName);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-brand-50 p-3 text-sm text-brand-800">
        <Spinner size="sm" />
        <span>Loading medicine information…</span>
      </div>
    );
  }

  if (error || !data?.medicine) {
    // Silently skip the card if we cannot get structured data
    return null;
  }

  const med = data.medicine;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 bg-brand-50 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <Pill className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="font-medium text-brand-900">{med.name}</p>
          <p className="text-xs text-brand-700">{med.drug_class}</p>
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <Field label="Dosage" value={med.dosage} />
        <Field label="Duration" value={med.duration} />
        <Field label="Side effects" value={med.side_effects} />
        <Field label="Availability" value={med.availability} />
      </div>

      {/* Warnings */}
      {med.warnings && (
        <div className="border-t border-amber-50 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <strong>Warning: </strong>{med.warnings}
        </div>
      )}

      {/* Source */}
      <div className="border-t border-gray-100 px-4 py-2 text-xs text-gray-400">
        Source: {med.source}
      </div>
    </div>
  );
}
