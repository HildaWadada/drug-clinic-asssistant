"use client";

import { useState } from "react";
import { ClinicList } from "@/components/clinics/ClinicList";
import { ClinicMap } from "@/components/clinics/ClinicMap";
import { ClinicDetailPanel } from "@/components/clinics/ClinicDetailPanel";
import { useClinics } from "@/hooks/useClinics";
import type { Clinic } from "@/lib/types";

const DISTRICT_OPTIONS = ["All districts", "kampala", "wakiso"];

export default function ClinicsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const { data, isLoading, error } = useClinics({ district: selectedDistrict });
  const clinics = data?.clinics ?? [];

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col">
      {/* Filter bar */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2">
        <label className="text-xs font-medium text-gray-500 dark:text-slate-400">District:</label>
        <select
          value={selectedDistrict ?? ""}
          onChange={(e) => {
            setSelectedDistrict(e.target.value || undefined);
            setSelectedClinic(null);
          }}
          className="rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
        >
          {DISTRICT_OPTIONS.map((d) => (
            <option key={d} value={d === "All districts" ? "" : d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
        {data && (
          <span className="text-xs text-gray-400 dark:text-slate-500">
            {data.total} {data.total === 1 ? "facility" : "facilities"}
          </span>
        )}
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Scrollable clinic list */}
        <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
          <ClinicList
            clinics={clinics}
            isLoading={isLoading}
            error={error}
            selectedClinic={selectedClinic}
            onSelect={setSelectedClinic}
          />
        </div>

        {/* RIGHT: Fixed map + detail panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-slate-950 p-4 gap-3">
          <div className="flex-1 min-h-0">
            <ClinicMap clinic={selectedClinic} />
          </div>
          {selectedClinic ? (
            <div className="flex-shrink-0">
              <ClinicDetailPanel clinic={selectedClinic} />
            </div>
          ) : (
            <div className="flex-shrink-0 flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-5 text-sm text-gray-400 dark:text-slate-500">
              Select a clinic from the list to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
