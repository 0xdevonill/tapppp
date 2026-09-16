import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-8",
  sm: "size-12",
  md: "size-20",
  lg: "size-[7.5rem]",
  xl: "size-[10.5rem]",
} as const;

export function TokenLogo({
  src,
  alt,
  size = "md",
  className,
  glow = false,
}: {
  src: string;
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "token-ring relative shrink-0 rounded-full p-[2px]",
        SIZES[size],
        glow && "shadow-[0_0_40px_rgba(232,195,106,0.28)]",
        className
      )}
    >
      <div className="size-full overflow-hidden rounded-full bg-[#07070b] p-[3px]">
        <img
          src={src}
          alt={alt}
          className="size-full rounded-full object-cover"
        />
      </div>
    </div>
  );
}

export function TickerChip({ ticker, className }: { ticker: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] tracking-[0.22em] text-gold",
        className
      )}
    >
      ${ticker}
    </span>
  );
}
