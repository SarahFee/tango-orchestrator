import { getEnergyColor } from "@/lib/tangoColors";

interface EnergyBarProps {
  energy: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function EnergyBar({ energy, className = "", showLabel = true, size = "sm" }: EnergyBarProps) {
  const color = getEnergyColor(energy);
  const width = (energy / 10) * 100;
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 ${height} rounded-full bg-black/20 dark:bg-white/10 overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-300`}
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums min-w-[1.5rem] text-right" style={{ color }}>
          {energy.toFixed(1)}
        </span>
      )}
    </div>
  );
}
