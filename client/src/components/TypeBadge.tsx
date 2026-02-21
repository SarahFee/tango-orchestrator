import { TANGO_COLORS } from "@/lib/tangoColors";
import type { TandaType } from "@shared/schema";

interface TypeBadgeProps {
  type: TandaType;
  size?: "sm" | "md";
  className?: string;
}

export function TypeBadge({ type, size = "sm", className = "" }: TypeBadgeProps) {
  const config = TANGO_COLORS[type];
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5";

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-md ${sizeClasses} ${className}`}
      style={{ backgroundColor: config.bg, color: config.text }}
      data-testid={`badge-type-${type}`}
    >
      {config.label}
    </span>
  );
}
