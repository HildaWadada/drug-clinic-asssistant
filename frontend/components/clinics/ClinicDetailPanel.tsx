import { Phone, Clock, MapPin, Building2, Info, CheckCircle, XCircle } from "lucide-react";
import type { Clinic } from "@/lib/types";

interface ClinicDetailPanelProps {
  clinic: Clinic;
}

function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
      <span className="mt-0.5 flex-shrink-0 text-brand-500">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export function ClinicDetailPanel({ clinic }: ClinicDetailPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{clinic.name}</h2>
        {clinic.is_open_24h ? (
          <span className="flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
            <CheckCircle className="h-3 w-3" />Open 24h
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-slate-400">
            <XCircle className="h-3 w-3" />Check hours
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <DetailRow icon={<MapPin className="h-4 w-4" />} text={clinic.address} />
        <DetailRow icon={<Clock className="h-4 w-4" />} text={clinic.hours} />
        <DetailRow icon={<Phone className="h-4 w-4" />} text={clinic.phone} />
        {clinic.services.length > 0 && (
          <DetailRow icon={<Building2 className="h-4 w-4" />} text={clinic.services.join(", ")} />
        )}
        {clinic.notes && (
          <DetailRow icon={<Info className="h-4 w-4" />} text={clinic.notes} />
        )}
      </div>
    </div>
  );
}
