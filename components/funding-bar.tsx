import { progressPct, formatUsd } from "@/lib/format";

export function FundingBar({
  raised,
  goal,
  size = "md",
}: {
  raised: number;
  goal: number;
  size?: "sm" | "md";
}) {
  const pct = progressPct(raised, goal);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
        <span className="font-mono tabular-nums text-foreground">
          {formatUsd(raised)} <span className="text-muted-foreground">of {formatUsd(goal)}</span>
        </span>
        <span className="font-mono tabular-nums text-gold">{pct.toFixed(0)}%</span>
      </div>
      <div
        className={`relative overflow-hidden rounded-full bg-white/8 ${size === "sm" ? "h-1.5" : "h-2.5"}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-gold via-[#f4d78a] to-lime"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
