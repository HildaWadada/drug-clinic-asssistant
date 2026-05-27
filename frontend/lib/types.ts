/**
 * types.ts
 * ─────────────────────────────────────────────────────────
 * Shared TypeScript types for the frontend.
 * These MUST match the Pydantic models in backend/models/.
 * When backend/models change, update these too.
 * ─────────────────────────────────────────────────────────
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

// ── UI State ──────────────────────────────────────────────

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceDocument[];
  medicine_name?: string | null;
  timestamp: Date;
}

export interface ApiError {
  detail: string;
}
