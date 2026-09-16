"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Copy, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FundingBar } from "@/components/funding-bar";
import { Countdown } from "@/components/countdown";
import { PegBoard } from "@/components/peg-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCoins } from "@/lib/store";
import { CHAINS } from "@/lib/constants";
import {
  demoAddress,
  formatCompactUsd,
  formatPct,
  formatUsd,
  progressPct,
  shorten,
} from "@/lib/format";
import { gapPct } from "@/lib/coins";
import type { ChainId } from "@/lib/types";

export default function CoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { getCoin, backCoin, wallet, connect, hydrated } = useCoins();
  const coin = getCoin(slug);
  const [chain, setChain] = useState<ChainId>("robinhood");
  const [amount, setAmount] = useState("250");

  const remaining = Math.max(0, (coin?.goalUsd ?? 0) - (coin?.raisedUsd ?? 0));
  const pct = progressPct(coin?.raisedUsd ?? 0, coin?.goalUsd ?? 1);
  const almost = coin?.status === "funding" && pct >= 70;
  const chainMeta = CHAINS.find((c) => c.id === chain)!;
  const address = demoAddress(chain, coin?.slug ?? "twin");
  const gap = coin?.status === "live" && coin ? gapPct(coin) : 0;

  const split = (() => {
    const backers = coin?.backers ?? [];
    const hood = backers
      .filter((b) => b.chain === "robinhood")
      .reduce((s, b) => s + b.amountUsd, 0);
    const sol = backers
      .filter((b) => b.chain === "solana")
      .reduce((s, b) => s + b.amountUsd, 0);
    return { hood, sol };
  })();

  if (!hydrated) {
    return (
      <AppShell>
        <div className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">
          Opening books…
        </div>
      </AppShell>
    );
  }

  if (!coin) {
    notFound();
    return null;
  }

  const active = coin;

  function copyAddr() {
    navigator.clipboard.writeText(address).then(() => {
      toast.message("Demo address copied. Do not send real funds.");
    });
  }

  function back() {
    const usd = Number(amount);
    if (!Number.isFinite(usd) || usd < 3) {
      toast.error("Minimum about $3.");
      return;
    }
    if (!wallet) connect();
    const next = backCoin(active.slug, chain, usd);
    if (!next) {
      toast.error("This coin is no longer funding.");
      return;
    }
    if (next.status === "launching") {
      toast.success("Goal hit. Launching on PONS and pump.fun now.");
    } else {
      toast.success(
        `Backed ${active.ticker} with ${formatUsd(Math.min(usd, remaining))} on ${chainMeta.short}.`
      );
    }
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Link href="/coins" className="text-sm text-muted-foreground hover:text-gold">
            ← All coins
          </Link>
          <div className="relative mt-5 overflow-hidden rounded-3xl">
            <img
              src={active.image}
              alt={active.name}
              className="aspect-square w-full object-cover sm:aspect-4/3"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute top-4 left-4 flex gap-2">
              {almost && (
                <Badge className="bg-lime text-black">
                  <Flame className="size-3" /> FOMO
                </Badge>
              )}
              <Badge className="bg-black/55 capitalize text-gold">{coin.status}</Badge>
            </div>
            <div className="absolute right-5 bottom-5 left-5">
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">
                {coin.name}
              </h1>
              <p className="mt-1 font-mono tracking-[0.18em] text-gold">
                ${coin.ticker}
              </p>
            </div>
          </div>
          <p className="mt-5 text-lg text-muted-foreground">{coin.blurb}</p>

          {coin.status === "live" && (
            <div className="mt-8">
              <PegBoard coin={coin} />
            </div>
          )}

          <div className="mt-8">
            <h2 className="font-display text-2xl">Backers</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {coin.backers.length} wallets. Coins land in the wallet that paid,
              on the chain that paid.
            </p>
            <ul className="mt-4 divide-y divide-white/8 rounded-2xl border border-white/8">
              {coin.backers.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Be the first backer. First buy is still empty.
                </li>
              )}
              {coin.backers.map((b) => {
                const c = CHAINS.find((x) => x.id === b.chain)!;
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <span className="font-mono">{shorten(b.wallet)}</span>
                    <span className="text-muted-foreground">
                      {b.amountAsset.toFixed(2)} {c.asset} · {formatUsd(b.amountUsd)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <aside className="lg:pt-8">
          <div className="hairline sticky top-24 space-y-5 rounded-3xl bg-card/85 p-5 sm:p-6">
            {coin.status === "funding" && (
              <>
                {almost && (
                  <p className="flex items-center gap-2 rounded-xl bg-lime/12 px-3 py-2 text-sm text-lime">
                    <span className="pulse-dot size-2 rounded-full bg-lime" />
                    {pct.toFixed(0)}% filled. When this bar hits 100% the first
                    buy is gone.
                  </p>
                )}
                <FundingBar raised={coin.raisedUsd} goal={coin.goalUsd} />
                <p className="text-sm text-muted-foreground">
                  Closes in <Countdown to={coin.closesAt} className="text-foreground" />
                  <span className="mx-2 text-white/20">·</span>
                  {formatUsd(remaining)} left
                </p>
              </>
            )}

            {coin.status === "launching" && (
              <div className="rounded-2xl bg-gold/12 p-4 text-gold">
                <p className="pulse-dot font-display text-2xl">Launching…</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fresh wallets. Create + first buy on PONS and pump.fun in the
                  same minute.
                </p>
              </div>
            )}

            {coin.status === "live" && (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Stat k="Hood mcap" v={formatCompactUsd(coin.mcapRobinhood ?? 0)} />
                <Stat k="Sol mcap" v={formatCompactUsd(coin.mcapSolana ?? 0)} />
                <Stat k="Peg gap" v={formatPct(gap)} />
                <Stat k="Bot chest" v={formatUsd(coin.botChestUsd ?? 0)} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {CHAINS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChain(c.id)}
                  className={`rounded-xl px-3 py-3 text-left text-sm ${
                    chain === c.id
                      ? "bg-gold text-[#140f08]"
                      : "bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <p className="font-medium">{c.short}</p>
                  <p className={chain === c.id ? "text-[#140f08]/70" : "text-muted-foreground"}>
                    {c.venue} · {c.asset}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {chainMeta.name} address
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 font-mono text-xs">
                <span className="flex-1 truncate">{address}</span>
                <button type="button" onClick={copyAddr} className="text-gold">
                  <Copy className="size-3.5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Demo address. Simulated backing only — never send real {chainMeta.asset}.
              </p>
            </div>

            {coin.status === "funding" && (
              <div className="space-y-3">
                <label className="text-sm">
                  Back with USD on {chainMeta.asset}
                  <Input
                    value={amount}
                    inputMode="decimal"
                    className="mt-2 h-11"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[50, 250, 500, remaining].filter((n) => n > 0).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className="rounded-full bg-white/6 px-3 py-1 text-xs hover:bg-white/10"
                      onClick={() => setAmount(String(Math.round(n)))}
                    >
                      {formatUsd(n)}
                    </button>
                  ))}
                </div>
                <Button
                  className="h-12 w-full rounded-full bg-gold text-base text-[#140f08] hover:bg-[#f4d78a]"
                  onClick={back}
                >
                  Simulate back on {chainMeta.short}
                </Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <p>
                Hood raised
                <span className="mt-1 block font-mono text-sm text-foreground">
                  {formatUsd(split.hood)}
                </span>
              </p>
              <p>
                Sol raised
                <span className="mt-1 block font-mono text-sm text-foreground">
                  {formatUsd(split.sol)}
                </span>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-white/4 px-3 py-3">
      <p className="text-xs text-muted-foreground">{k}</p>
      <p className="mt-1 font-mono">{v}</p>
    </div>
  );
}
