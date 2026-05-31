"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, HeartPulse, MapPin, Pill, BookOpen } from "lucide-react";
import { TopicChips } from "@/components/chat/TopicChips";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { sanitiseInput } from "@/lib/utils";

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 shadow-sm">
      <span className="text-brand-500 mb-1">{icon}</span>
      <span className="text-lg font-semibold text-gray-900 dark:text-white">{value}</span>
      <span className="text-xs text-gray-500 dark:text-slate-400 text-center">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const q = sanitiseInput(query);
    if (!q) return;
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  };

  const handleChipSelect = (question: string) => {
    router.push(`/chat?q=${encodeURIComponent(question)}`);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      {/* Badge */}
      <div className="mb-5 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500 px-3 py-1 text-xs font-medium text-brand-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Grounded in Uganda MoH &amp; WHO guidelines
        </span>
      </div>

      {/* Hero */}
      <div className="mb-6 text-center">
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Understand your medicines.
          <br />
          Find trusted clinics.
        </h1>
        <p className="mx-auto max-w-md text-gray-500 dark:text-slate-400">
          Free health information for everyone in Uganda — in simple language,
          based on official guidelines. No sign up needed.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatCard icon={<Pill className="h-5 w-5" />} value="6 PDFs" label="Uganda MoH & WHO guidelines" />
        <StatCard icon={<MapPin className="h-5 w-5" />} value="14+" label="Clinics & hospitals listed" />
        <StatCard icon={<BookOpen className="h-5 w-5" />} value="Free" label="No account required" />
      </div>

      {/* Disclaimer */}
      <div className="mb-5 flex items-center justify-center gap-1.5 rounded-lg border border-amber-100 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10 px-4 py-2 text-xs text-amber-800 dark:text-amber-300">
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
          className="flex-1 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-gray-900 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <Button onClick={handleSearch} size="lg">
          Ask
        </Button>
      </div>

      {/* Quick topics */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-slate-500">
          Common questions
        </p>
        <TopicChips onSelect={handleChipSelect} />
      </div>
    </div>
  );
}
