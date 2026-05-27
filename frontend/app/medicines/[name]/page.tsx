/**
 * page.tsx — Medicine detail (/medicines/[name])
 * Shows full AI-generated structured medicine information.
 */

"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Pill } from "lucide-react";
import { useMedicine } from "@/hooks/useMedicine";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import ReactMarkdown from "react-markdown";

interface PageProps {
  params: Promise<{ name: string }>;
}

interface FieldCardProps {
  label: string;
  value: string;
}

function FieldCard({ label, value }: FieldCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm leading-relaxed text-gray-800">{value}</p>
    </div>
  );
}

export default function MedicineDetailPage({ params }: PageProps) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const { data, isLoading, error } = useMedicine(decodedName);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/medicines"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Medicines A–Z
      </Link>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {error && <ErrorMessage message={error} />}

      {data && (
        <>
          {/* Header */}
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-brand-100 bg-brand-50 p-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-500">
              <Pill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-brand-900">
                {data.medicine?.name ?? decodedName}
              </h1>
              {data.medicine?.drug_class && (
                <p className="text-sm text-brand-700">{data.medicine.drug_class}</p>
              )}
            </div>
          </div>

          {/* Structured fields if available */}
          {data.medicine ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldCard label="What it treats" value={data.medicine.uses} />
              <FieldCard label="How to take it" value={data.medicine.dosage} />
              <FieldCard label="Duration" value={data.medicine.duration} />
              <FieldCard label="Side effects" value={data.medicine.side_effects} />
              <div className="sm:col-span-2">
                <FieldCard label="Important warnings" value={data.medicine.warnings} />
              </div>
              <div className="sm:col-span-2">
                <FieldCard label="Where to get it in Uganda" value={data.medicine.availability} />
              </div>
            </div>
          ) : (
            // Fallback: render the raw AI answer as Markdown
            <div className="prose prose-sm max-w-none rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <ReactMarkdown>{data.raw_answer}</ReactMarkdown>
            </div>
          )}

          {/* Sources */}
          {data.sources.length > 0 && (
            <div className="mt-4 rounded-xl border border-gray-100 bg-white p-4 text-xs text-gray-400 shadow-sm">
              <p className="font-medium text-gray-500">Sources</p>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {data.sources.map((s, i) => (
                  <li key={i}>{String(s.source_file ?? "")}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
            ⚕ This information is general guidance only. Always consult a qualified
            health professional for personal medical advice.
          </p>
        </>
      )}
    </div>
  );
}
