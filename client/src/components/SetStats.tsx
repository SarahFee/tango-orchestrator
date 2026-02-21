import type { Tanda, MilongaSet } from "@shared/schema";
import { getOrchestra, getStyleLabel } from "@/lib/orchestraData";
import { TANGO_COLORS, STYLE_COLORS } from "@/lib/tangoColors";

interface SetStatsProps {
  set: MilongaSet;
  tandas: (Tanda | null)[];
  onUpdateSet?: (updates: Partial<MilongaSet>) => void;
}

export function SetStats({ set, tandas, onUpdateSet }: SetStatsProps) {
  const filledTandas = tandas.filter((t): t is Tanda => t !== null);
  const totalTandas = filledTandas.length;
  const avgEnergy = totalTandas > 0
    ? filledTandas.reduce((sum, t) => sum + t.energy, 0) / totalTandas
    : 0;

  const estimatedMinutes = filledTandas.reduce((sum, t) => {
    const mins = t.trackCount * 3 + 1;
    return sum + mins;
  }, 0);
  const hours = Math.floor(estimatedMinutes / 60);
  const mins = estimatedMinutes % 60;

  const typeCounts = { tango: 0, vals: 0, milonga: 0 };
  filledTandas.forEach((t) => {
    if (t.type in typeCounts) typeCounts[t.type as keyof typeof typeCounts]++;
  });

  const styleCounts: Record<string, number> = {};
  filledTandas.forEach((t) => {
    if (t.style) styleCounts[t.style] = (styleCounts[t.style] || 0) + 1;
  });

  const uniqueOrchestras = new Set(filledTandas.map((t) => t.orchestraId)).size;

  return (
    <div className="space-y-4 p-3" data-testid="set-stats">
      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Set Name</label>
        <input
          value={set.name}
          onChange={(e) => onUpdateSet?.({ name: e.target.value })}
          className="w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none font-serif text-sm py-1 transition-colors"
          data-testid="input-set-name"
        />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Venue</label>
        <input
          value={set.venue || ""}
          onChange={(e) => onUpdateSet?.({ venue: e.target.value })}
          placeholder="Optional"
          className="w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none text-sm py-1 transition-colors"
          data-testid="input-venue"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Date</label>
          <input
            type="date"
            value={set.date}
            onChange={(e) => onUpdateSet?.({ date: e.target.value })}
            className="w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none text-sm py-1 transition-colors"
            data-testid="input-date"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Start Time</label>
          <input
            type="time"
            value={set.startTime}
            onChange={(e) => onUpdateSet?.({ startTime: e.target.value })}
            className="w-full bg-transparent border-b border-border/30 focus:border-primary/50 outline-none text-sm py-1 transition-colors"
            data-testid="input-start-time"
          />
        </div>
      </div>

      <div className="border-t border-border/30 pt-3">
        <div className="grid grid-cols-2 gap-y-2.5 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tandas</p>
            <p className="font-serif font-semibold text-lg tabular-nums" data-testid="text-total-tandas">{totalTandas}/{tandas.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</p>
            <p className="font-serif font-semibold text-lg tabular-nums" data-testid="text-duration">
              {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Energy</p>
            <p className="font-serif font-semibold text-lg tabular-nums" data-testid="text-avg-energy">{avgEnergy.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Orchestras</p>
            <p className="font-serif font-semibold text-lg tabular-nums" data-testid="text-unique-orchestras">{uniqueOrchestras}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 pt-3">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Type Distribution</p>
        <div className="space-y-1.5">
          {(Object.entries(typeCounts) as [string, number][]).map(([t, count]) => {
            const percent = totalTandas > 0 ? (count / totalTandas) * 100 : 0;
            const config = TANGO_COLORS[t as keyof typeof TANGO_COLORS];
            return (
              <div key={t} className="flex items-center gap-2">
                <span className="text-xs w-14 capitalize">{config?.label || t}</span>
                <div className="flex-1 h-2 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%`, backgroundColor: config?.bg }}
                  />
                </div>
                <span className="text-xs tabular-nums w-8 text-right text-muted-foreground">
                  {percent.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {Object.keys(styleCounts).length > 0 && (
        <div className="border-t border-border/30 pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Style Distribution</p>
          <div className="space-y-1.5">
            {Object.entries(styleCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([style, count]) => {
                const percent = totalTandas > 0 ? (count / totalTandas) * 100 : 0;
                const color = STYLE_COLORS[style] || "#888";
                return (
                  <div key={style} className="flex items-center gap-2">
                    <span className="text-xs w-20 truncate">{getStyleLabel(style)}</span>
                    <div className="flex-1 h-2 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="text-xs tabular-nums w-8 text-right text-muted-foreground">
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
