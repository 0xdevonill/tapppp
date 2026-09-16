"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoftCapMeter } from "@/components/soft-cap";
import { TokenLogo, TickerChip } from "@/components/token-logo";
import { ChainDot, Eyebrow, Panel, StatusChip } from "@/components/ui-bits";
import { Countdown } from "@/components/countdown";
import { useCoins } from "@/lib/store";
import { CHAINS } from "@/lib/constants";
import { formatUsd, shorten } from "@/lib/format";

export function FeaturedCoin() {
  const { coins } = useCoins();
  const coin =
    coins.find((c) => c.featured && c.status === "funding") ??
    coins.find((c) => c.status === "funding") ??
    coins[0];

  if (!coin) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Featured twin</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Built so nobody gets in before you.
          </h2>
        </div>
        <Link
          href={`/coins/${coin.slug}`}
          className="hidden items-center gap-1 text-sm text-gold sm:flex"
        >
          Open {coin.ticker} <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <Panel className="grid overflow-hidden md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className="relative flex min-h-[340px] flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(232,195,106,0.16),transparent_62%)] px-6 py-12">
          <TokenLogo src={coin.image} alt={coin.name} size="xl" glow />
          <TickerChip ticker={coin.ticker} className="mt-6" />
          <p className="mt-3 font-display text-3xl font-semibold">{coin.name}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-black">
            <span className="pulse-dot size-1.5 rounded-full bg-black" />
            Soft cap almost gone
          </p>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={coin.status} />
              <span className="text-xs text-muted-foreground">
                PONS · pump.fun
              </span>
            </div>
            <p className="mt-4 text-muted-foreground">{coin.blurb}</p>
            <div className="mt-6">
              <SoftCapMeter raised={coin.raisedUsd} softCap={coin.goalUsd} />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Closes in <Countdown to={coin.closesAt} className="text-foreground" />
              <span className="mx-2 text-white/20">·</span>
              {coin.backers.length} wallets already inside the first buy
            </p>
          </div>

          <div className="mt-8 space-y-2">
            {coin.backers.slice(0, 3).map((b) => {
              const chain = CHAINS.find((c) => c.id === b.chain)!;
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/4 px-4 py-3 text-sm"
                >
                  <span className="flex items-center gap-2 font-mono text-muted-foreground">
                    <ChainDot chain={b.chain} />
                    {shorten(b.wallet)}
                  </span>
                  <span>
                    +{b.amountAsset.toFixed(2)} {chain.asset}
                  </span>
                </div>
              );
            })}
            <Button
              render={<Link href={`/coins/${coin.slug}`} />}
              className="mt-2 h-12 w-full rounded-full bg-gold text-base text-[#140f08] hover:bg-[#f4d78a]"
            >
              Back {coin.ticker} before the soft cap fills
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Soft cap {formatUsd(coin.goalUsd)} · overpayments bounce back
            </p>
          </div>
        </div>
      </Panel>
    </section>
  );
}
