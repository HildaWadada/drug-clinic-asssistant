/**
 * utils.ts — Shared utility functions.
 * Pure functions only — no side effects, no API calls.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function sanitiseInput(input: string): string {
  return input.trim().replace(/\s{2,}/g, " ");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "\u2026";
}

export function capitalise(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatClinicType(type: string): string {
  const labels: Record<string, string> = {
    public: "Public (free services)",
    private: "Private",
    NGO: "NGO / Faith-based",
  };
  return labels[type] ?? type;
}

export function formatDistrict(district: string): string {
  return district.charAt(0).toUpperCase() + district.slice(1).toLowerCase();
}

export function formatSourceLabel(filename: string): string {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
