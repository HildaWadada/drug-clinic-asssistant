import type { Clinic } from "@/lib/types";

interface MapEmbedProps {
  clinic?: Clinic | null;
}

export function MapEmbed({ clinic }: MapEmbedProps) {
  if (!clinic) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 rounded-lg text-sm text-gray-400">
        Select a clinic to see it on the map
      </div>
    );
  }

  // Use clinic.latitude and clinic.longitude (matching the Clinic type)
  const src = `https://maps.google.com/maps?q=${clinic.latitude},${clinic.longitude}&z=15&output=embed`;

  return (
    <iframe
      title={`Map showing ${clinic.name}`}
      src={src}
      className="h-full w-full rounded-lg border border-gray-200"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
