import { useMemo } from "react";
import type { Tanda, TandaType } from "@shared/schema";
import { getOrchestra, getTTVTTMLabel, getExpectedType } from "@/lib/orchestraData";
import { EnergyBar } from "./EnergyBar";
import { TypeBadge } from "./TypeBadge";
import { X, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { useLanguage } from "@/hooks/useLanguage";

interface TimelineSlotProps {
  index: number;
  tanda: Tanda | null;
  showPattern: boolean;
  startTime: string;
  cumulativeMinutes: number;
  onRemove?: () => void;
  highlightSlots?: number[];
}

export function TimelineSlot({
  index,
  tanda,
  showPattern,
  startTime,
  cumulativeMinutes,
  onRemove,
  highlightSlots = [],
}: TimelineSlotProps) {
  const { t } = useLanguage();
  const patternLabel = getTTVTTMLabel(index);
  const expectedType = getExpectedType(index);
  const mismatch = tanda && showPattern && tanda.type !== expectedType;
  const isHighlighted = highlightSlots.includes(index);
  const slotId = `slot-${index}`;

  const { isOver, setNodeRef: setDropRef } = useDroppable({
    id: slotId,
    data: { type: "slot", index },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tanda ? `timeline-${tanda.id}` : `empty-${index}`,
    data: { type: "timeline-tanda", index, tanda },
    disabled: !tanda,
  });

  const style = transform
    ? { transform: CSS.Transform.toString(transform), transition }
    : undefined;

  const slotTime = useMemo(() => {
    const [h, m] = startTime.split(":").map(Number);
    const totalMins = h * 60 + m + cumulativeMinutes;
    const hours = Math.floor(totalMins / 60) % 24;
    const minutes = totalMins % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }, [startTime, cumulativeMinutes]);

  const orchestra = tanda ? getOrchestra(tanda.orchestraId) : null;

  return (
    <div ref={setDropRef} className="relative" data-testid={`timeline-slot-${index}`}>
      {index > 0 && (
        <div className="flex items-center justify-center h-5 relative">
          <div className="w-px h-full" style={{ background: "linear-gradient(to bottom, #c9a84c33, #c9a84c11)" }} />
          <span className="absolute text-[8px] text-muted-foreground/50 tracking-widest uppercase">cortina</span>
        </div>
      )}

      <div
        ref={setSortRef}
        style={style}
        className={`relative rounded-md border transition-all duration-200 ${
          isDragging ? "opacity-50 z-50" : ""
        } ${
          isOver && !tanda
            ? "border-primary/60 bg-primary/5 scale-[1.02]"
            : tanda
            ? `border-border/40 bg-card ${mismatch ? "ring-1 ring-yellow-500/40" : ""} ${isHighlighted ? "ring-1 ring-red-500/40" : ""}`
            : "border-dashed border-border/30 bg-transparent"
        }`}
      >
        <div className="flex items-stretch min-h-[4.5rem]">
          <div className="flex flex-col items-center justify-center w-8 border-r border-border/20 flex-shrink-0">
            <span className="text-[10px] font-medium text-muted-foreground tabular-nums">{index + 1}</span>
            <span className="text-[8px] text-muted-foreground/60">{slotTime}</span>
            {showPattern && (
              <span
                className={`mt-0.5 text-[9px] font-bold ${
                  mismatch ? "text-yellow-400" : "text-muted-foreground/40"
                }`}
              >
                {patternLabel}
              </span>
            )}
          </div>

          {tanda ? (
            <div className="flex-1 p-2 flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground/40 flex-shrink-0"
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <TypeBadge type={tanda.type as TandaType} size="sm" />
                  <span className="font-serif text-sm font-semibold truncate">
                    {orchestra?.name || tanda.orchestraId}
                  </span>
                </div>
                {tanda.singer && (
                  <p className="text-xs text-muted-foreground truncate">{tanda.singer}</p>
                )}
                <div className="mt-1">
                  <EnergyBar energy={tanda.energy} size="sm" />
                </div>
              </div>
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="flex-shrink-0 text-muted-foreground/40 hover:text-destructive transition-colors"
                  data-testid={`button-remove-slot-${index}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-2">
              <p className="text-xs text-muted-foreground/40 italic">{t("drop_tanda_here")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
