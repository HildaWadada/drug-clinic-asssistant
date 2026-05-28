/**
 * types.ts — Shared TypeScript types for the frontend.
 * These MUST match the Pydantic models in backend/models/.
 */

// ── Chat ─────────────────────────────────────────────────

export interface ChatRequest {
  question: string;
  session_id?: string;
}

export interface SourceDocument {
  source_file: string;
  page_number: number;
  category: string;
  excerpt: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceDocument[];
  is_safe: boolean;
  safety_message: string | null;
  medicine_name: string | null;
}

// ── Chat message (UI state) ───────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceDocument[];
  medicine_name?: string | null;
  timestamp: Date;
}

// Keep Message as alias so both naming conventions work
export type Message = ChatMessage;

// ── Medicine ──────────────────────────────────────────────

export interface MedicineDetail {
  name: string;
  drug_class: string;
  uses: string;
  dosage: string;
  duration: string;
  side_effects: string;
  warnings: string;
  availability: string;
  source: string;
}

// Alias so components/medicine/MedicineCard.tsx keeps working
export type MedicineInfo = MedicineDetail;

export interface MedicineResponse {
  found: boolean;
  medicine: MedicineDetail | null;
  raw_answer: string;
  sources: Record<string, unknown>[];
}

// ── Clinics ───────────────────────────────────────────────

export interface Clinic {
  name: string;
  address: string;
  district: string;
  phone: string;
  hours: string;
  type: "public" | "private" | "NGO";
  latitude: number;
  longitude: number;
  is_open_24h: boolean;
  services: string[];
  notes: string;
}

export interface ClinicsResponse {
  clinics: Clinic[];
  total: number;
  district: string | null;
}

// Alias so lib/api.ts and lib/hooks/useClinics.ts keep working
export type ClinicListResponse = ClinicsResponse;

// ── API error ─────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
