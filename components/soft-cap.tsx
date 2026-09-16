import { formatUsd, progressPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SoftCapMeter({
  raised,
  softCap,
  size = "md",
  className,
}: {
  raised: number;
  softCap: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const pct = progressPct(raised, softCap);
  const remaining = Math.max(0, softCap - raised);
  const compact = size === "sm";

  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("grid gap-3", compact ? "grid-cols-3" : "grid-cols-3")}>
        <Metric label="Raised" value={formatUsd(raised)} compact={compact} />
        <Metric label="Soft cap" value={formatUsd(softCap)} gold compact={compact} />
        <Metric
          label={remaining > 0 ? "Until cap" : "Filled"}
          value={remaining > 0 ? formatUsd(remaining) : "100%"}
          compact={compact}
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          <span>Soft cap progress</span>
          <span className="font-mono tabular-nums text-gold">{pct.toFixed(0)}%</span>
        </div>
        <div
          className={cn(
            "relative overflow-hidden rounded-full bg-white/8",
            compact ? "h-1.5" : "h-2.5"
          )}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-gold via-[#f4d78a] to-lime"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function Metric({
  label,
  value,
  gold,
  compact,
}: {
  label: string;
  value: string;
  gold?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 truncate font-display font-semibold tabular-nums tracking-tight",
          compact ? "text-base" : "text-xl sm:text-2xl",
          gold ? "text-gold" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
