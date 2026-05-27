/**
 * useClinics.ts
 * Fetch and filter clinics from the API using React Query.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchClinics } from "@/lib/api-client";
import type { ClinicsResponse } from "@/lib/types";

interface UseClinicsParams {
  district?: string;
  type?: string;
  open_24h?: boolean;
}

interface UseClinicsReturn {
  data: ClinicsResponse | undefined;
  isLoading: boolean;
  error: string | null;
}

export function useClinics(params: UseClinicsParams = {}): UseClinicsReturn {
  const { district, type, open_24h } = params;

  const query = useQuery({
    queryKey: ["clinics", district, type, open_24h],
    queryFn: () => fetchClinics({ district, type, open_24h }),
    staleTime: 5 * 60 * 1000, // Cache clinic data for 5 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
