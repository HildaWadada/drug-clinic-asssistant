import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-800">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>
        Not a diagnostic tool — this app provides health information only.
        Always consult a qualified healthcare professional.
      </span>
    </div>
  );
}
