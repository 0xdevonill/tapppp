"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Copy, Flame } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SoftCapMeter } from "@/components/soft-cap";
import { TokenLogo, TickerChip } from "@/components/token-logo";
import { ChainDot, Eyebrow, Panel, StatusChip } from "@/components/ui-bits";
import { Countdown } from "@/components/countdown";
import { PegBoard } from "@/components/peg-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      toast.success("Soft cap hit. Launching on PONS and pump.fun now.");
    } else {
      toast.success(
        `Backed ${active.ticker} with ${formatUsd(Math.min(usd, remaining))} on ${chainMeta.short}.`
      );
    }
  }

  return (
    <AppShell>
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(700px 420px at 18% 0%, rgba(232,195,106,0.16), transparent 60%), url(${active.image})`,
            backgroundSize: "auto, 140%",
            backgroundPosition: "center, center",
            filter: "blur(28px)",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#07070b]/70 via-[#07070b]/92 to-[#07070b]" />

        <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-4 sm:px-6">
          <Link
            href="/coins"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-gold"
          >
            <ArrowLeft className="size-3.5" /> All coins
          </Link>

          <Panel className="mt-6 p-5 sm:p-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-center">
              <TokenLogo
                src={active.image}
                alt={active.name}
                size="xl"
                glow
                className="mx-auto md:mx-0"
              />
              <div className="min-w-0 flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <TickerChip ticker={active.ticker} />
                  <StatusChip status={active.status} />
                  {almost && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-[11px] font-semibold text-black">
                      <Flame className="size-3" /> Almost at soft cap
                    </span>
                  )}
                </div>
                <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
                  {active.name}
                </h1>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  {active.blurb}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Twin launch · Robinhood Chain via PONS · Solana via pump.fun
                </p>
              </div>
            </div>

            {(active.status === "funding" || active.status === "launching") && (
              <div className="mt-8 border-t border-white/8 pt-7">
                <SoftCapMeter raised={active.raisedUsd} softCap={active.goalUsd} />
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <span>
                    Window{" "}
                    <Countdown to={active.closesAt} className="text-foreground" />
                  </span>
                  <span>{active.backers.length} backers inside the first buy</span>
                  <span>Over the soft cap bounces back</span>
                </div>
              </div>
            )}

            {active.status === "live" && (
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/8 pt-7 sm:grid-cols-4">
                <LiveStat label="Hood mcap" value={formatCompactUsd(active.mcapRobinhood ?? 0)} />
                <LiveStat label="Sol mcap" value={formatCompactUsd(active.mcapSolana ?? 0)} />
                <LiveStat label="Peg gap" value={formatPct(gap)} />
                <LiveStat label="Bot chest" value={formatUsd(active.botChestUsd ?? 0)} />
              </div>
            )}
          </Panel>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          {active.status === "live" && <PegBoard coin={active} />}

          <Panel className="p-5 sm:p-7">
            <Eyebrow>First buyers</Eyebrow>
            <h2 className="mt-2 font-display text-2xl font-semibold">Backers</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {active.backers.length} wallets. Coins land in the wallet that paid,
              on the chain that paid — inside the launch transaction.
            </p>
            <ul className="mt-5 divide-y divide-white/8">
              {active.backers.length === 0 && (
                <li className="py-10 text-center text-sm text-muted-foreground">
                  Be the first backer. The first buy is still empty.
                </li>
              )}
              {active.backers.map((b) => {
                const c = CHAINS.find((x) => x.id === b.chain)!;
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 py-3.5 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <ChainDot chain={b.chain} />
                      <span className="truncate font-mono">{shorten(b.wallet)}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-mono text-foreground">
                        {b.amountAsset.toFixed(2)} {c.asset}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatUsd(b.amountUsd)} · {c.short}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>

        <aside>
          <Panel className="sticky top-24 space-y-5 p-5 sm:p-6">
            <div>
              <Eyebrow>Backing desk</Eyebrow>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {active.status === "live" ? "Trade the twin" : "Get inside the first buy"}
              </h2>
            </div>

            {active.status === "funding" && almost && (
              <p className="flex items-center gap-2 rounded-2xl bg-lime/12 px-3.5 py-3 text-sm text-lime">
                <span className="pulse-dot size-2 rounded-full bg-lime" />
                {pct.toFixed(0)}% of the soft cap is in. When this fills, the first
                buy is gone.
              </p>
            )}

            {active.status === "launching" && (
              <div className="rounded-2xl bg-gold/12 p-4 text-gold">
                <p className="font-display text-2xl">Launching…</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Soft cap reached. Fresh wallets. Create + first buy on PONS and
                  pump.fun in the same minute.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {CHAINS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChain(c.id)}
                  className={`rounded-2xl px-3 py-3 text-left transition ${
                    chain === c.id
                      ? "bg-gold text-[#140f08]"
                      : "bg-white/4 hover:bg-white/8"
                  }`}
                >
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        background: chain === c.id ? "#140f08" : c.color,
                      }}
                    />
                    {c.short}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      chain === c.id ? "text-[#140f08]/70" : "text-muted-foreground"
                    }`}
                  >
                    {c.venue} · {c.asset}
                  </p>
                </button>
              ))}
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {chainMeta.name} address
              </p>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/45 px-3 py-2.5 font-mono text-xs">
                <span className="flex-1 truncate">{address}</span>
                <button
                  type="button"
                  onClick={copyAddr}
                  className="rounded-full p-1 text-gold hover:bg-gold/10"
                  aria-label="Copy address"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Demo address. Simulated backing only — never send real {chainMeta.asset}.
              </p>
            </div>

            {active.status === "funding" && (
              <div className="space-y-3">
                <label className="text-sm">
                  Amount in USD, paid in {chainMeta.asset}
                  <Input
                    value={amount}
                    inputMode="decimal"
                    className="mt-2 h-12 rounded-xl text-base"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[50, 250, 500, remaining]
                    .filter((n) => n > 0)
                    .map((n) => (
                      <button
                        key={n}
                        type="button"
                        className="rounded-full bg-white/6 px-3 py-1.5 text-xs hover:bg-white/10"
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

            <div className="grid grid-cols-2 gap-3 border-t border-white/8 pt-4">
              <div>
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <ChainDot chain="robinhood" /> Hood raised
                </p>
                <p className="mt-1 font-display text-lg font-semibold">
                  {formatUsd(split.hood)}
                </p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <ChainDot chain="solana" /> Sol raised
                </p>
                <p className="mt-1 font-display text-lg font-semibold">
                  {formatUsd(split.sol)}
                </p>
              </div>
            </div>
          </Panel>
        </aside>
      </section>
    </AppShell>
  );
}

function LiveStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
    </div>
  );
}
