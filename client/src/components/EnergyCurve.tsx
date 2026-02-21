import { useMemo } from "react";
import type { Tanda } from "@shared/schema";
import { TANGO_COLORS } from "@/lib/tangoColors";
import { getEnergyColor } from "@/lib/tangoColors";
import { useLanguage } from "@/hooks/useLanguage";

interface EnergyCurveProps {
  tandas: (Tanda | null)[];
  className?: string;
}

export function EnergyCurve({ tandas, className = "" }: EnergyCurveProps) {
  const { t } = useLanguage();
  const filledPoints = useMemo(() => {
    return tandas
      .map((t, i) => (t ? { index: i, energy: t.energy, type: t.type } : null))
      .filter(Boolean) as { index: number; energy: number; type: string }[];
  }, [tandas]);

  if (filledPoints.length < 2) {
    return (
      <div className={`flex items-center justify-center ${className}`} data-testid="energy-curve-empty">
        <p className="text-sm text-muted-foreground font-serif italic">
          {t("energy_curve_empty")}
        </p>
      </div>
    );
  }

  const width = 800;
  const height = 120;
  const padding = { top: 15, right: 30, bottom: 25, left: 35 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const totalSlots = tandas.length;
  const xScale = (i: number) => padding.left + (i / Math.max(totalSlots - 1, 1)) * chartW;
  const yScale = (e: number) => padding.top + chartH - ((e - 1) / 9) * chartH;

  const pathPoints = filledPoints.map((p) => ({
    x: xScale(p.index),
    y: yScale(p.energy),
    ...p,
  }));

  let pathD = "";
  if (pathPoints.length >= 2) {
    pathD = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      const prev = pathPoints[i - 1];
      const curr = pathPoints[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      pathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }

  const fillD =
    pathD +
    ` L ${pathPoints[pathPoints.length - 1].x} ${height - padding.bottom} L ${pathPoints[0].x} ${height - padding.bottom} Z`;

  return (
    <div className={`w-full ${className}`} data-testid="energy-curve">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {[1, 3, 5, 7, 9].map((e) => (
          <g key={e}>
            <line
              x1={padding.left}
              y1={yScale(e)}
              x2={width - padding.right}
              y2={yScale(e)}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeDasharray="3,3"
            />
            <text
              x={padding.left - 8}
              y={yScale(e) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize="9"
            >
              {e}
            </text>
          </g>
        ))}

        {filledPoints.length >= 2 && (
          <>
            <path d={fillD} fill="url(#energyFill)" />
            <path d={pathD} fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {pathPoints.map((p, i) => {
          const typeColor = TANGO_COLORS[p.type as keyof typeof TANGO_COLORS]?.bg || "#c9a84c";
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="5" fill={typeColor} stroke="#0f0b09" strokeWidth="1.5" />
              <text
                x={p.x}
                y={height - padding.bottom + 14}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="8"
              >
                {p.index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
