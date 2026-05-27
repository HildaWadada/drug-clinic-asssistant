/**
 * ClinicMap.tsx
 * Google Maps embed showing the selected clinic location.
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env
 */

"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Spinner } from "@/components/ui/Spinner";
import type { Clinic } from "@/lib/types";

interface ClinicMapProps {
  clinic: Clinic | null;
}

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%", minHeight: "200px" };

// Default centre: Kampala
const DEFAULT_CENTER = { lat: 0.3163, lng: 32.5822 };

export function ClinicMap({ clinic }: ClinicMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  if (loadError) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400">
        Map unavailable — Google Maps API key not configured.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
        <Spinner />
      </div>
    );
  }

  const centre = clinic
    ? { lat: clinic.latitude, lng: clinic.longitude }
    : DEFAULT_CENTER;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={centre}
        zoom={clinic ? 15 : 12}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {clinic && (
          <Marker
            position={{ lat: clinic.latitude, lng: clinic.longitude }}
            title={clinic.name}
          />
        )}
      </GoogleMap>
    </div>
  );
}
