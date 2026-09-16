import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FundingBar } from "@/components/funding-bar";
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
      className="group hairline relative flex flex-col overflow-hidden rounded-2xl bg-card/80 transition hover:-translate-y-0.5 hover:bg-card"
    >
      <div className="relative aspect-4/5 overflow-hidden sm:aspect-square">
        <img
          src={coin.image}
          alt={coin.name}
          className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {coin.hot && coin.status === "funding" && (
            <Badge className="bg-lime text-black">HOT</Badge>
          )}
          {coin.status === "funding" && (
            <Badge className="bg-black/60 text-gold">Funding</Badge>
          )}
          {launching && <Badge className="bg-gold text-black">Launching</Badge>}
          {live && <Badge className="bg-white/15 text-lime">Live</Badge>}
        </div>
        <div className="absolute right-3 bottom-3 left-3">
          <p className="font-display text-2xl font-semibold tracking-tight">
            {coin.name}
          </p>
          <p className="font-mono text-xs tracking-[0.18em] text-gold">
            ${coin.ticker}
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">{coin.blurb}</p>
        {coin.status === "funding" || launching ? (
          <>
            <FundingBar raised={coin.raisedUsd} goal={coin.goalUsd} size="sm" />
            <p className="text-xs text-muted-foreground">
              Closes in <Countdown to={coin.closesAt} className="text-foreground" />
              <span className="mx-2 text-white/20">·</span>
              {coin.backers.length} backers
            </p>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/4 px-3 py-2">
              <p className="text-muted-foreground">Hood mcap</p>
              <p className="font-mono">{formatCompactUsd(coin.mcapRobinhood ?? 0)}</p>
            </div>
            <div className="rounded-lg bg-white/4 px-3 py-2">
              <p className="text-muted-foreground">Sol mcap</p>
              <p className="font-mono">{formatCompactUsd(coin.mcapSolana ?? 0)}</p>
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
