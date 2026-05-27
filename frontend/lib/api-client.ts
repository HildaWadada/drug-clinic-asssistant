/**
 * api-client.ts
 * ─────────────────────────────────────────────────────────
 * Typed fetch wrapper for all backend API calls.
 *
 * All components and hooks import from here.
 * Never call fetch() or axios directly in components.
 * ─────────────────────────────────────────────────────────
 */

import axios, { AxiosError } from "axios";
import type {
  ChatRequest,
  ChatResponse,
  ClinicsResponse,
  MedicineResponse,
} from "./types";

// ── Axios instance ────────────────────────────────────────

const api = axios.create({
  // next.config.js proxies /api/* to the FastAPI backend
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s — AI responses can be slow
});

// ── Error normalisation ───────────────────────────────────

function normaliseError(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

// ── API functions ─────────────────────────────────────────

/**
 * Send a chat question to the backend and get an AI answer.
 */
export async function sendChatMessage(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const { data } = await api.post<ChatResponse>("/chat", request);
    return data;
  } catch (error) {
    throw new Error(normaliseError(error));
  }
}

/**
 * Fetch clinic list with optional filters.
 */
export async function fetchClinics(params?: {
  district?: string;
  type?: string;
  open_24h?: boolean;
}): Promise<ClinicsResponse> {
  try {
    const { data } = await api.get<ClinicsResponse>("/clinics", { params });
    return data;
  } catch (error) {
    throw new Error(normaliseError(error));
  }
}

/**
 * Fetch detailed information about a specific medicine.
 */
export async function fetchMedicine(name: string): Promise<MedicineResponse> {
  try {
    const { data } = await api.get<MedicineResponse>(
      `/medicine/${encodeURIComponent(name)}`
    );
    return data;
  } catch (error) {
    throw new Error(normaliseError(error));
  }
}

/**
 * Check if the backend is reachable.
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const { data } = await api.get("/health");
    return data.status === "ok";
  } catch {
    return false;
  }
}
