"use client";

import { useCoins } from "@/lib/store";
import { formatUsd, shorten } from "@/lib/format";
import { CHAINS } from "@/lib/constants";

export function LiveTicker() {
  const { coins } = useCoins();
  const events = coins.flatMap((coin) =>
    coin.backers.slice(0, 3).map((b) => {
      const chain = CHAINS.find((c) => c.id === b.chain)!;
      return `${shorten(b.wallet)} backed ${coin.ticker} with ${formatUsd(b.amountUsd)} on ${chain.short}`;
    })
  );
  const live = coins
    .filter((c) => c.status === "live")
    .map(
      (c) =>
        `${c.ticker} live · Hood ${formatUsd(c.mcapRobinhood ?? 0)} · Sol ${formatUsd(c.mcapSolana ?? 0)}`
    );
  const row = [
    ...events,
    ...live,
    "Soft cap fills · first buy is locked",
    "4% peg · 1 minute launch · gas only to create",
  ];
  const loop = [...row, ...row];

  return (
    <div className="relative overflow-hidden border-b border-white/8 bg-black/40 py-2">
      <div className="ticker flex w-max gap-8 whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="text-gold">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
