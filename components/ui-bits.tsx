import { CHAINS } from "@/lib/constants";
import type { ChainId, CoinStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.22em] text-gold",
        className
      )}
    >
      {children}
    </p>
  );
}

export function StatusChip({ status }: { status: CoinStatus }) {
  const map: Record<CoinStatus, string> = {
    funding: "bg-gold/15 text-gold ring-gold/25",
    launching: "bg-gold text-[#140f08] ring-gold/40",
    live: "bg-lime/15 text-lime ring-lime/25",
    missed: "bg-white/8 text-muted-foreground ring-white/10",
  };
  const label: Record<CoinStatus, string> = {
    funding: "Funding",
    launching: "Launching",
    live: "Live",
    missed: "Missed",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1",
        map[status]
      )}
    >
      {status === "funding" || status === "launching" ? (
        <span className="pulse-dot size-1.5 rounded-full bg-current" />
      ) : null}
      {label[status]}
    </span>
  );
}

export function ChainDot({ chain }: { chain: ChainId }) {
  const meta = CHAINS.find((c) => c.id === chain)!;
  return (
    <span
      className="inline-block size-2 shrink-0 rounded-full"
      style={{ background: meta.color, boxShadow: `0 0 10px ${meta.glow}` }}
      title={meta.name}
    />
  );
}

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel", className)}>{children}</div>
  );
}
