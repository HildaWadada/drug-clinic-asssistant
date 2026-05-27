/**
 * page.tsx — Clinic finder (/clinics)
 * Split view: clinic list on left, map + detail on right.
 */

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

  const { data, isLoading, error } = useClinics({
    district: selectedDistrict,
  });

  const clinics = data?.clinics ?? [];

  return (
    <div className="flex flex-1 flex-col">
      {/* Filter bar */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-2">
        <label className="text-xs font-medium text-gray-500">District:</label>
        <select
          value={selectedDistrict ?? ""}
          onChange={(e) => {
            setSelectedDistrict(e.target.value || undefined);
            setSelectedClinic(null);
          }}
          className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 focus:border-brand-500 focus:outline-none"
        >
          {DISTRICT_OPTIONS.map((d) => (
            <option key={d} value={d === "All districts" ? "" : d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
        {data && (
          <span className="text-xs text-gray-400">
            {data.total} {data.total === 1 ? "facility" : "facilities"}
          </span>
        )}
      </div>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Clinic list */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-100 bg-white">
          <ClinicList
            clinics={clinics}
            isLoading={isLoading}
            error={error}
            selectedClinic={selectedClinic}
            onSelect={setSelectedClinic}
          />
        </div>

        {/* Right: Map + detail */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          <div className="flex-1">
            <ClinicMap clinic={selectedClinic} />
          </div>
          {selectedClinic && (
            <ClinicDetailPanel clinic={selectedClinic} />
          )}
          {!selectedClinic && (
            <div className="flex items-center justify-center rounded-xl border border-gray-100 bg-white py-6 text-sm text-gray-400">
              Select a clinic from the list to see details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
