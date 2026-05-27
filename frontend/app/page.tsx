/**
 * page.tsx — Landing page (/)
 * Hero section, search bar, and quick topic chips.
 */

"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, HeartPulse } from "lucide-react";
import { TopicChips } from "@/components/chat/TopicChips";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { sanitiseInput } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = sanitiseInput(query);
    if (!q) return;
    // Navigate to /chat with the question pre-filled via URL param
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  const handleChipSelect = (question: string) => {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      {/* Badge */}
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
          <ShieldCheck className="h-3.5 w-3.5" />
          Grounded in Uganda MoH &amp; WHO guidelines
        </span>
      </div>

      {/* Hero */}
      <div className="mb-6 text-center">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900">
          Understand your medicines.
          <br />
          Find trusted clinics.
        </h1>
        <p className="mx-auto max-w-md text-gray-500">
          Ask any question about medicines or health in simple language. Get
          answers based on official Uganda health guidelines.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-5 flex items-center justify-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
        <HeartPulse className="h-3.5 w-3.5" />
        Not a diagnostic tool — always consult a doctor for personal medical advice
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ask about a medicine, symptom, or clinic..."
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <Button onClick={handleSearch} size="lg">
          Ask
        </Button>
      </div>

      {/* Quick topics */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Common questions
        </p>
        <TopicChips onSelect={handleChipSelect} />
      </div>
    </div>
  );
}
