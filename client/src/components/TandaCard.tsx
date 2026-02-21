import type { Tanda, TandaType } from "@shared/schema";
import { getOrchestra, getStyleLabel } from "@/lib/orchestraData";
import { EnergyBar } from "./EnergyBar";
import { TypeBadge } from "./TypeBadge";
import { GripVertical, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface TandaCardProps {
  tanda: Tanda;
  isDragging?: boolean;
  showGrip?: boolean;
  showRemove?: boolean;
  onRemove?: () => void;
  compact?: boolean;
  className?: string;
}

export function TandaCard({
  tanda,
  isDragging = false,
  showGrip = false,
  showRemove = false,
  onRemove,
  compact = false,
  className = "",
}: TandaCardProps) {
  const { t } = useLanguage();
  const orchestra = getOrchestra(tanda.orchestraId);
  const name = orchestra?.name || tanda.orchestraId;

  return (
    <div
      className={`group relative rounded-md border border-border/50 transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${compact ? "p-2" : "p-3"} ${className}`}
      style={{
        backgroundColor: "hsl(var(--card))",
      }}
      data-testid={`tanda-card-${tanda.id}`}
    >
      <div className="flex items-start gap-2">
        {showGrip && (
          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground/50 mt-0.5">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <TypeBadge type={tanda.type as TandaType} size="sm" />
            <span className="text-xs text-muted-foreground">{tanda.trackCount} {t("tracks").toLowerCase()}</span>
          </div>
          <p className={`font-serif font-semibold truncate ${compact ? "text-xs" : "text-sm"}`}>
            {name}
          </p>
          {tanda.singer && (
            <p className="text-xs text-muted-foreground truncate">{tanda.singer}</p>
          )}
          {tanda.era && (
            <p className="text-[10px] text-muted-foreground/70 truncate">{tanda.era}</p>
          )}
          <div className="mt-1.5">
            <EnergyBar energy={tanda.energy} size="sm" />
          </div>
          {tanda.style && !compact && (
            <p className="text-[10px] text-muted-foreground/60 mt-1">{getStyleLabel(tanda.style)}</p>
          )}
        </div>
        {showRemove && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-destructive"
            data-testid={`button-remove-tanda-${tanda.id}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
