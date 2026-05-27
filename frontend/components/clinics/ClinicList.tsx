/**
 * ClinicList.tsx
 * Scrollable list of clinic cards with a search input.
 */

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ClinicCard } from "./ClinicCard";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { Clinic } from "@/lib/types";

interface ClinicListProps {
  clinics: Clinic[];
  isLoading: boolean;
  error: string | null;
  selectedClinic: Clinic | null;
  onSelect: (clinic: Clinic) => void;
}

export function ClinicList({
  clinics,
  isLoading,
  error,
  selectedClinic,
  onSelect,
}: ClinicListProps) {
  const [search, setSearch] = useState("");

  const filtered = clinics.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">
        <Search className="h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search clinics or area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          No clinics found. Try a different search.
        </p>
      )}

      {/* List */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        {filtered.map((clinic) => (
          <ClinicCard
            key={clinic.name}
            clinic={clinic}
            isSelected={selectedClinic?.name === clinic.name}
            onClick={() => onSelect(clinic)}
          />
        ))}
      </div>
    </div>
  );
}
