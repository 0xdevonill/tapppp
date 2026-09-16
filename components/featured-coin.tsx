"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FundingBar } from "@/components/funding-bar";
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
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Featured coin
          </p>
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

      <div className="hairline grid overflow-hidden rounded-3xl bg-card/80 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-[320px]">
          <img
            src={coin.image}
            alt={coin.name}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute right-5 bottom-5 left-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-black">
              <span className="pulse-dot size-1.5 rounded-full bg-black" />
              Funding opens — almost gone
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Name
                </p>
                <p className="mt-1 font-medium">{coin.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Ticker
                </p>
                <p className="mt-1 font-mono">{coin.ticker}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Goal
                </p>
                <p className="mt-1 font-mono">{formatUsd(coin.goalUsd)}</p>
              </div>
            </div>
            <p className="mt-5 text-muted-foreground">{coin.blurb}</p>
            <div className="mt-6">
              <FundingBar raised={coin.raisedUsd} goal={coin.goalUsd} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Closes in <Countdown to={coin.closesAt} className="text-foreground" />
              <span className="mx-2 text-white/20">·</span>
              {coin.backers.length} wallets already inside the first buy
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {coin.backers.slice(0, 3).map((b) => {
              const chain = CHAINS.find((c) => c.id === b.chain)!;
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/4 px-4 py-3 text-sm"
                >
                  <span className="font-mono text-muted-foreground">
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
              Back {coin.ticker} before it fills
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
