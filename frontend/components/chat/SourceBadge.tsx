import { FileText } from "lucide-react";

interface SourceBadgeProps {
  source: string;
  page: number;
}

export function SourceBadge({ source, page }: SourceBadgeProps) {
  // Convert filename to a readable label
  const label = source
    .replace(".pdf", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-800">
      <FileText className="h-3 w-3" />
      {label}, p.{page}
    </span>
  );
}
