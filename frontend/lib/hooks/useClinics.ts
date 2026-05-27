"use client";

import useSWR from "swr";
import { api } from "../api";
import type { ClinicListResponse } from "../types";

interface UseClinicsOptions {
  district?: string;
  type?: string;
  open_24h?: boolean;
}

export function useClinics(options: UseClinicsOptions = {}) {
  const key = ["clinics", options.district, options.type, options.open_24h];

  const { data, error, isLoading } = useSWR<ClinicListResponse>(
    key,
    () => api.getClinics(options),
    { revalidateOnFocus: false }
  );

  return {
    clinics: data?.clinics ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? "Failed to load clinics." : null,
  };
}
