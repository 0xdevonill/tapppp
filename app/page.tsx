"use client";

import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { LiveTicker } from "@/components/live-ticker";
import { FeaturedCoin } from "@/components/featured-coin";
import { HowSteps } from "@/components/how-steps";
import { CoinCard } from "@/components/coin-card";
import { PegBoard } from "@/components/peg-board";
import { Button } from "@/components/ui/button";
import { useCoins } from "@/lib/store";
import { CHAINS, SITE } from "@/lib/constants";
import { formatUsd } from "@/lib/format";

const STATS = [
  { k: "2", l: "chains, one launch, one minute" },
  { k: "4%", l: "maximum gap the bot will allow" },
  { k: "3%", l: "trade fee — 2% funds the peg bot" },
  { k: "$2,500", l: "minimum goal. Creating costs only gas" },
];

export default function HomePage() {
  const { coins } = useCoins();
  const liveCoin = coins.find((c) => c.status === "live") ?? coins[0];
  const launched = coins.filter((c) => c.status === "live").length;

  return (
    <AppShell>
      <LiveTicker />

      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <Image
          src="/brand/banner.png"
          alt=""
          fill
          priority
          className="object-cover opacity-55"
        />
        <div className="grain pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-[#07070b]/55 to-[#07070b]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Twins logo"
              width={64}
              height={64}
              className="size-14 rounded-full ring-1 ring-gold/50 sm:size-16"
            />
            <p className="text-xs uppercase tracking-[0.28em] text-gold">
              Twin-chain launchpad
            </p>
          </div>

          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[0.95] font-semibold tracking-tight sm:text-7xl">
            One coin.
            <br />
            Two chains.
            <br />
            <span className="text-gold">One price.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#d9d2c2] sm:text-xl">
            Launch once and your coin goes live on Robinhood Chain and Solana in
            the same minute. Backers sit inside the first buy. A fee-funded bot
            keeps both prices within 4%.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/launch" />}
              className="h-12 rounded-full bg-gold px-7 text-base text-[#140f08] hover:bg-[#f4d78a]"
            >
              Launch a twin
            </Button>
            <Button
              render={<Link href="/coins" />}
              variant="outline"
              className="h-12 rounded-full border-white/20 bg-black/30 px-7 text-base"
            >
              Back a coin before it exists
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {CHAINS.map((c) => (
              <a
                key={c.id}
                href={c.venueUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-sm backdrop-blur-md hover:border-gold/40"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ background: c.color }}
                />
                {c.name} · {c.venue} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="border-y border-white/8 bg-black/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="px-5 py-7">
              <p className="font-display text-3xl font-semibold text-gold sm:text-4xl">
                {s.k}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-20">
        <FeaturedCoin />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">The machine</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-5xl">
          Four moves. Then the bot never sleeps.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Snipers watch deployer wallets. Twins never reuses one. When the goal
          hits, both venues go live in the same minute and every backer is
          already in the first buy.
        </p>
        <div className="mt-10">
          <HowSteps />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              The peg
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Two books. One number.
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-muted-foreground md:block">
            {launched} coins launched on both chains. {SITE.maxGapPct}% band.
            {SITE.botFeePct}% of every trade keeps it honest.
          </p>
        </div>
        <PegBoard coin={liveCoin} />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Every coin, both chains
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Funding now, and already live.
            </h2>
          </div>
          <Button render={<Link href="/coins" />} variant="ghost" className="text-gold">
            See all
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coins.slice(0, 6).map((coin) => (
            <CoinCard key={coin.slug} coin={coin} />
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6">
        <div className="hairline relative overflow-hidden rounded-3xl">
          <Image
            src="/brand/wordmark.png"
            alt="TWINS"
            fill
            className="object-cover opacity-40"
          />
          <div className="relative bg-black/55 px-6 py-16 sm:px-12 sm:py-20">
            <p className="font-serif-italic text-2xl text-[#f4e7c2] sm:text-3xl">
              “You are inside the first buy, or you are not in at all.”
            </p>
            <p className="mt-6 max-w-xl text-muted-foreground">
              Set a goal, share two addresses, and the moment the goal is in your
              coin is live on Robinhood Chain and Solana — with every backer
              inside the first buy. Creating is free apart from gas. Launch fees
              come out of the raise.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <span>{formatUsd(SITE.minGoal)} minimum goal</span>
              <span>Gas only to create</span>
              <span>1 minute from goal to live</span>
              <span>3% trade fee, 2% funds the bot</span>
            </div>
            <Button
              render={<Link href="/launch" />}
              className="mt-8 h-12 rounded-full bg-gold px-7 text-base text-[#140f08] hover:bg-[#f4d78a]"
            >
              Launch on two chains
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-3xl font-semibold">Before you ape.</h2>
        <dl className="mt-8 space-y-8">
          {[
            [
              "What do I need to launch?",
              "A name, a ticker, a picture and a funding goal from $2,500. Creating costs only gas.",
            ],
            [
              "How do backers pay?",
              "They send ETH on Robinhood Chain or SOL on Solana to the coin's addresses from their own wallet. Anything over the goal comes straight back.",
            ],
            [
              "What happens when the goal is reached?",
              "The coin is created on Robinhood Chain (PONS) and Solana (pump.fun) within a minute, from wallets nobody has seen before. Backers are inside the first buy on both chains.",
            ],
            [
              "How is the price kept equal?",
              "Every trade pays 3%. 2% of it funds a bot that buys wherever the coin is cheapest and sells wherever it is dearest, aiming to keep the gap under 4%.",
            ],
            [
              "What if the goal is missed?",
              "Everyone is refunded to the wallet they paid from, automatically.",
            ],
          ].map(([q, a]) => (
            <div key={q} className="border-b border-white/8 pb-8">
              <dt className="font-medium">{q}</dt>
              <dd className="mt-2 text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </AppShell>
  );
}
