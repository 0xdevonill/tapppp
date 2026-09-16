import Link from "next/link";
import { SoftCapMeter } from "@/components/soft-cap";
import { TokenLogo, TickerChip } from "@/components/token-logo";
import { StatusChip } from "@/components/ui-bits";
import { Countdown } from "@/components/countdown";
import { formatCompactUsd, formatPct } from "@/lib/format";
import { gapPct } from "@/lib/coins";
import type { Coin } from "@/lib/types";

export function CoinCard({ coin }: { coin: Coin }) {
  const live = coin.status === "live";
  const launching = coin.status === "launching";
  const gap = live ? gapPct(coin) : 0;

  return (
    <Link
      href={`/coins/${coin.slug}`}
      className="panel group relative flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1"
    >
      <div className="relative flex flex-col items-center px-5 pt-8 pb-5">
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
          <StatusChip status={coin.status} />
          {coin.hot && coin.status === "funding" ? (
            <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold tracking-wide text-black">
              HOT
            </span>
          ) : (
            <span />
          )}
        </div>
        <TokenLogo
          src={coin.image}
          alt={coin.name}
          size="lg"
          className="mt-6 transition duration-500 group-hover:scale-[1.03]"
        />
        <TickerChip ticker={coin.ticker} className="mt-5" />
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {coin.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-center text-sm leading-relaxed text-muted-foreground">
          {coin.blurb}
        </p>
      </div>
      <div className="mt-auto border-t border-white/8 px-5 py-4">
        {coin.status === "funding" || launching ? (
          <>
            <SoftCapMeter raised={coin.raisedUsd} softCap={coin.goalUsd} size="sm" />
            <p className="mt-3 text-xs text-muted-foreground">
              Closes in <Countdown to={coin.closesAt} className="text-foreground" />
              <span className="mx-2 text-white/20">·</span>
              {coin.backers.length} backers
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Hood mcap
              </p>
              <p className="mt-1 font-display text-base font-semibold">
                {formatCompactUsd(coin.mcapRobinhood ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Sol mcap
              </p>
              <p className="mt-1 font-display text-base font-semibold">
                {formatCompactUsd(coin.mcapSolana ?? 0)}
              </p>
            </div>
            <p className="col-span-2 text-muted-foreground">
              Peg {formatPct(gap)} · {coin.backers.length} first buyers
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
