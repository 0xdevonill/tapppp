"use client";

import { formatCompactUsd, formatPct, formatUsd } from "@/lib/format";
import { gapPct } from "@/lib/coins";
import type { Coin } from "@/lib/types";
import { CHAINS } from "@/lib/constants";

export function PegBoard({ coin }: { coin: Coin }) {
  const hood = coin.mcapRobinhood ?? 0;
  const sol = coin.mcapSolana ?? 0;
  const gap = gapPct(coin);
  const inSync = gap <= 4;
  const max = Math.max(hood, sol, 1);

  return (
    <div className="hairline rounded-2xl bg-card/80 p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            The peg
          </p>
          <p className="mt-1 font-display text-4xl font-semibold">4%</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Maximum gap between the two market caps. A bot funded by 2% of every
            trade buys where the coin is cheapest and sells where it is dearest.
          </p>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            inSync ? "bg-lime/15 text-lime" : "bg-gold/15 text-gold"
          }`}
        >
          {inSync ? "In sync" : "Rebalancing"} · {formatPct(gap)}
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {CHAINS.map((chain) => {
          const value = chain.id === "robinhood" ? hood : sol;
          const width = (value / max) * 100;
          return (
            <div key={chain.id}>
              <div className="mb-2 flex items-baseline justify-between text-sm">
                <span>
                  {chain.name}{" "}
                  <span className="text-muted-foreground">· {chain.venue}</span>
                </span>
                <span className="font-mono">{formatCompactUsd(value)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${width}%`,
                    background: chain.color,
                    boxShadow: `0 0 18px ${chain.glow}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {coin.botTrades.slice(0, 3).map((trade) => {
          const chain = CHAINS.find((c) => c.id === trade.chain)!;
          return (
            <div key={trade.id} className="rounded-xl bg-white/4 px-4 py-3 text-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {trade.action === "buy" ? "Buy" : "Sell"} {chain.short}
              </p>
              <p className="mt-1 font-mono">{formatUsd(trade.usd)} gap</p>
              <p className="text-xs text-muted-foreground">
                {formatPct(trade.gapFrom)} to {formatPct(trade.gapTo)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
