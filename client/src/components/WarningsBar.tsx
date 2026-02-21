import { useState } from "react";
import type { Warning } from "@/lib/warnings";
import { AlertTriangle, Lightbulb, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface WarningsBarProps {
  warnings: Warning[];
  className?: string;
}

export function WarningsBar({ warnings, className = "" }: WarningsBarProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const visible = warnings.filter((w) => !dismissed.has(w.id));

  if (visible.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`} data-testid="warnings-bar">
      {visible.map((w) => (
        <div
          key={w.id}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
            w.type === "warning"
              ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20"
              : "bg-blue-500/15 text-blue-300 border border-blue-500/20"
          }`}
          data-testid={`warning-${w.id}`}
        >
          {w.type === "warning" ? (
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
          ) : (
            <Lightbulb className="w-3 h-3 flex-shrink-0" />
          )}
          <span>{t(w.messageKey, w.messageParams)}</span>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(w.id))}
            className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
            data-testid={`button-dismiss-warning-${w.id}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
