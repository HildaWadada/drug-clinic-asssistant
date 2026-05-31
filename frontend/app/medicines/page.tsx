"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Pill } from "lucide-react";

const MEDICINES = [
  { name: "Amoxicillin", category: "Antibiotic" },
  { name: "Artemether-Lumefantrine", category: "Antimalarial" },
  { name: "Artesunate", category: "Antimalarial" },
  { name: "Atenolol", category: "Blood pressure" },
  { name: "Cetirizine", category: "Antihistamine" },
  { name: "Ciprofloxacin", category: "Antibiotic" },
  { name: "Cotrimoxazole", category: "Antibiotic" },
  { name: "Diazepam", category: "Sedative" },
  { name: "Diclofenac", category: "Painkiller" },
  { name: "Dolutegravir", category: "HIV/ARV" },
  { name: "Doxycycline", category: "Antibiotic" },
  { name: "Efavirenz", category: "HIV/ARV" },
  { name: "Ferrous Sulphate", category: "Iron supplement" },
  { name: "Fluconazole", category: "Antifungal" },
  { name: "Folic Acid", category: "Supplement" },
  { name: "Glibenclamide", category: "Diabetes" },
  { name: "Hydrocortisone", category: "Steroid" },
  { name: "Ibuprofen", category: "Painkiller" },
  { name: "Insulin", category: "Diabetes" },
  { name: "Lamivudine", category: "HIV/ARV" },
  { name: "Lisinopril", category: "Blood pressure" },
  { name: "Metformin", category: "Diabetes" },
  { name: "Metronidazole", category: "Antibiotic" },
  { name: "Morphine", category: "Painkiller" },
  { name: "Nystatin", category: "Antifungal" },
  { name: "Omeprazole", category: "Stomach" },
  { name: "Oral Rehydration Salts", category: "Hydration" },
  { name: "Paracetamol", category: "Painkiller" },
  { name: "Phenobarbitone", category: "Epilepsy" },
  { name: "Prednisolone", category: "Steroid" },
  { name: "Salbutamol", category: "Asthma" },
  { name: "Tenofovir", category: "HIV/ARV" },
  { name: "Tramadol", category: "Painkiller" },
];

const CATEGORY_COLOURS: Record<string, string> = {
  Antibiotic: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  Antimalarial: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  "Blood pressure": "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
  Diabetes: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  "HIV/ARV": "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  Painkiller: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300",
};

export default function MedicinesPage() {
  const [search, setSearch] = useState("");

  const filtered = MEDICINES.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">Medicines A–Z</h1>
      <p className="mb-5 text-sm text-gray-500 dark:text-slate-400">
        Common medicines on the Uganda MoH Essential Medicines List. Click any
        medicine to see how it works, dosage, and side effects.
      </p>

      {/* Search */}
      <div className="mb-5 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 shadow-sm">
        <Search className="h-4 w-4 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search medicines…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filtered.map((med) => (
          <Link
            key={med.name}
            href={`/medicines/${encodeURIComponent(med.name.toLowerCase())}`}
            className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 transition-colors hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-900/20"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <Pill className="h-4 w-4 text-brand-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{med.name}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLOURS[med.category] ?? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300"}`}>
              {med.category}
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-400 dark:text-slate-500">
          No medicines found for &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
