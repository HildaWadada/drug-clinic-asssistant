/**
 * utils.ts
 * ─────────────────────────────────────────────────────────
 * Shared utility functions used across the frontend.
 * Pure functions only — no side effects, no API calls.
 * ─────────────────────────────────────────────────────────
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Tailwind class merging ────────────────────────────────

/**
 * Merge Tailwind classes safely, resolving conflicts.
 * Use this everywhere instead of template literals for classes.
 *
 * Example: cn("px-2 py-1", isActive && "bg-brand-500", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ── String helpers ────────────────────────────────────────

/**
 * Sanitise user input before sending to the API.
 * Trims whitespace and collapses internal multiple spaces.
 */
export function sanitiseInput(input: string): string {
  return input.trim().replace(/\s{2,}/g, " ");
}

/**
 * Truncate a string to maxLength characters, appending "…" if cut.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalise(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ── ID generation ─────────────────────────────────────────

/**
 * Generate a unique ID for chat messages.
 * Uses crypto.randomUUID when available, falls back to timestamp.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ── Clinic helpers ────────────────────────────────────────

/**
 * Return a human-readable label for a clinic type.
 */
export function formatClinicType(type: string): string {
  const labels: Record<string, string> = {
    public: "Public (free services)",
    private: "Private",
    NGO: "NGO / Faith-based",
  };
  return labels[type] ?? type;
}

/**
 * Return a display-friendly district name.
 */
export function formatDistrict(district: string): string {
  return district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
}

// ── Source formatting ─────────────────────────────────────

/**
 * Convert a raw source filename to a readable citation label.
 * e.g. "uganda_moh_essential_medicines_2023.pdf" → "Uganda MoH Essential Medicines (2023)"
 */
export function formatSourceLabel(filename: string): string {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
