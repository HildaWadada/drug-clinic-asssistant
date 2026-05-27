/**
 * useMedicine.ts
 * Fetch detailed medicine information by name using React Query.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMedicine } from "@/lib/api-client";
import type { MedicineResponse } from "@/lib/types";

interface UseMedicineReturn {
  data: MedicineResponse | undefined;
  isLoading: boolean;
  error: string | null;
}

export function useMedicine(name: string | null): UseMedicineReturn {
  const query = useQuery({
    queryKey: ["medicine", name],
    queryFn: () => fetchMedicine(name!),
    enabled: Boolean(name), // Only fetch when a name is provided
    staleTime: 10 * 60 * 1000, // Medicine info is stable — cache 10 minutes
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : null,
  };
}
