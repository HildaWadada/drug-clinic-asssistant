/**
 * DisclaimerBanner.tsx
 * Persistent warning strip shown on chat and medicine pages.
 * Keeps users aware this is an information tool, not diagnosis.
 */

import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-800">
      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>
        <strong>Not a diagnostic tool.</strong> This assistant provides general
        health information only. Always visit a clinic or health centre for
        personal medical advice.
      </span>
    </div>
  );
}
