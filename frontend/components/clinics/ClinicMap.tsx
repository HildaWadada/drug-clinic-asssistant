/**
 * ClinicMap.tsx
 * Shows clinic location using OpenStreetMap via iframe.
 * No API key needed — completely free.
 * Map fills the full height of its container.
 */

import type { Clinic } from "@/lib/types";

interface ClinicMapProps {
  clinic: Clinic | null;
}

export function ClinicMap({ clinic }: ClinicMapProps) {
  if (!clinic) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-sm text-gray-400">
        <div className="text-center">
          <p className="text-2xl mb-2">🗺️</p>
          <p>Select a clinic to see its location</p>
        </div>
      </div>
    );
  }

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${clinic.longitude - 0.008},${clinic.latitude - 0.008},${clinic.longitude + 0.008},${clinic.latitude + 0.008}&layer=mapnik&marker=${clinic.latitude},${clinic.longitude}`;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      {/* Map header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-500"></span>
          <span className="text-sm font-medium text-gray-700">{clinic.name}</span>
        </div>
        <a
          href={`https://www.openstreetmap.org/?mlat=${clinic.latitude}&mlon=${clinic.longitude}&zoom=16`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-600 hover:underline"
        >
          Open in maps ↗
        </a>
      </div>

      {/* Map iframe fills remaining space */}
      <iframe
        title={`Map showing ${clinic.name}`}
        src={src}
        className="flex-1 w-full border-0"
        loading="lazy"
      />
    </div>
  );
}
