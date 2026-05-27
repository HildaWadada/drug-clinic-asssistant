/**
 * TopicChips.tsx
 * Quick-tap starter questions shown on the landing and chat pages.
 * Clicking a chip sends the question directly.
 */

import { Pill, MapPin, AlertCircle, BookOpen, Heart, Syringe } from "lucide-react";

interface TopicChip {
  icon: React.ReactNode;
  label: string;
  question: string;
}

const CHIPS: TopicChip[] = [
  { icon: <Pill className="h-3.5 w-3.5" />, label: "What is Paracetamol?", question: "What is Paracetamol and how do I take it?" },
  { icon: <MapPin className="h-3.5 w-3.5" />, label: "Find nearby clinics", question: "How do I find a clinic near me in Kampala?" },
  { icon: <AlertCircle className="h-3.5 w-3.5" />, label: "Drug side effects", question: "What are common drug side effects I should watch out for?" },
  { icon: <BookOpen className="h-3.5 w-3.5" />, label: "Explain prescription", question: "What does BD, TDS, and OD mean on a prescription?" },
  { icon: <Syringe className="h-3.5 w-3.5" />, label: "Malaria medicines", question: "How is malaria treated in Uganda?" },
  { icon: <Heart className="h-3.5 w-3.5" />, label: "Blood pressure drugs", question: "What medicines are used for high blood pressure in Uganda?" },
];

interface TopicChipsProps {
  onSelect: (question: string) => void;
}

export function TopicChips({ onSelect }: TopicChipsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {CHIPS.map((chip) => (
        <button
          key={chip.label}
          onClick={() => onSelect(chip.question)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left text-sm text-gray-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
        >
          <span className="text-brand-500">{chip.icon}</span>
          {chip.label}
        </button>
      ))}
    </div>
  );
}
