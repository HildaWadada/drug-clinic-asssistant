/**
 * Typed API client.
 * All network calls go through here — never call fetch() directly in components.
 */

import type {
  ChatRequest,
  ChatResponse,
  ClinicListResponse,
  MedicineResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Unknown error");
    throw new Error(`API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  chat: (body: ChatRequest): Promise<ChatResponse> =>
    fetchJSON<ChatResponse>("/api/chat", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMedicine: (name: string): Promise<MedicineResponse> =>
    fetchJSON<MedicineResponse>(`/api/medicine/${encodeURIComponent(name)}`),

  getClinics: (params?: {
    district?: string;
    type?: string;
    open_24h?: boolean;
  }): Promise<ClinicListResponse> => {
    const query = new URLSearchParams();
    if (params?.district) query.set("district", params.district);
    if (params?.type) query.set("type", params.type);
    if (params?.open_24h !== undefined) query.set("open_24h", String(params.open_24h));
    const qs = query.toString();
    return fetchJSON<ClinicListResponse>(`/api/clinics${qs ? `?${qs}` : ""}`);
  },

  healthCheck: (): Promise<{ status: string }> =>
    fetchJSON<{ status: string }>("/api/health"),
};
