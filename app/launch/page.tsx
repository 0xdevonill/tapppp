"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CHAINS, GOAL_PRESETS, SITE, WINDOW_PRESETS } from "@/lib/constants";
import { useCoins } from "@/lib/store";
import { formatUsd } from "@/lib/format";

const PRESET_ART = [
  "/coins/hoodcat.png",
  "/coins/twinpepe.png",
  "/coins/solhood.png",
  "/coins/dualdog.png",
  "/coins/mirror.png",
];

export default function LaunchPage() {
  const router = useRouter();
  const { createCoin, wallet, connect } = useCoins();
  const [name, setName] = useState("");
  const [ticker, setTicker] = useState("");
  const [blurb, setBlurb] = useState("");
  const [goal, setGoal] = useState(5000);
  const [windowHours, setWindowHours] = useState(24);
  const [image, setImage] = useState(PRESET_ART[0]);
  const [busy, setBusy] = useState(false);

  const openingMcap = useMemo(() => goal * 2, [goal]);

  function onFile(file?: File) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Picture must be under 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submit() {
    if (!name.trim() || name.trim().length > 32) {
      toast.error("Name up to 32 characters.");
      return;
    }
    if (!ticker.trim() || ticker.trim().length > 10) {
      toast.error("Ticker up to 10 characters.");
      return;
    }
    if (!wallet) {
      connect();
      toast.message("Demo wallet connected. Hit launch again.");
      return;
    }
    setBusy(true);
    const coin = createCoin({
      name,
      ticker,
      image,
      blurb,
      goalUsd: goal,
      windowHours,
    });
    toast.success(`${coin.ticker} is open for backing on both chains.`);
    router.push(`/coins/${coin.slug}`);
  }

  return (
    <AppShell>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Launch</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
            Launch on two chains.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            One form. When the goal is in, your coin goes live on Robinhood Chain
            and Solana in the same minute, from wallets nobody has seen before,
            with every backer inside the first buy.
          </p>

          <div className="mt-10 space-y-8">
            <fieldset className="hairline space-y-4 rounded-2xl p-5">
              <legend className="px-1 text-xs uppercase tracking-[0.18em] text-gold">
                1 · Identity
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    maxLength={32}
                    placeholder="Hood Cat"
                    className="h-11"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticker">Ticker</Label>
                  <Input
                    id="ticker"
                    value={ticker}
                    maxLength={10}
                    placeholder="HOODCAT"
                    className="h-11 uppercase"
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blurb">Pitch</Label>
                <Textarea
                  id="blurb"
                  value={blurb}
                  placeholder="Why this coin has to exist on both chains tonight."
                  className="min-h-24"
                  onChange={(e) => setBlurb(e.target.value)}
                />
              </div>
              <div>
                <Label>Picture</Label>
                <p className="mt-1 mb-3 text-xs text-muted-foreground">
                  Under 4 MB. Used on PONS and pump.fun.
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ART.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setImage(src)}
                      className={`size-14 overflow-hidden rounded-xl ring-2 ${
                        image === src ? "ring-gold" : "ring-transparent"
                      }`}
                    >
                      <img src={src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                  <label className="flex size-14 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-muted-foreground">
                    +
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </fieldset>

            <fieldset className="hairline space-y-4 rounded-2xl p-5">
              <legend className="px-1 text-xs uppercase tracking-[0.18em] text-gold">
                2 · Funding goal
              </legend>
              <div className="flex flex-wrap gap-2">
                {GOAL_PRESETS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`rounded-full px-4 py-2 text-sm ${
                      goal === g
                        ? "bg-gold text-[#140f08]"
                        : "bg-white/6 text-foreground hover:bg-white/10"
                    }`}
                  >
                    {formatUsd(g)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Opening market cap on both chains ≈ {formatUsd(openingMcap)}. Even
                start — both books open at the same price from the first second.
              </p>
              <div>
                <Label>Window</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WINDOW_PRESETS.map((w) => (
                    <button
                      key={w.hours}
                      type="button"
                      onClick={() => setWindowHours(w.hours)}
                      className={`rounded-full px-4 py-2 text-sm ${
                        windowHours === w.hours
                          ? "bg-gold text-[#140f08]"
                          : "bg-white/6 hover:bg-white/10"
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>
            </fieldset>

            <Button
              className="h-12 w-full rounded-full bg-gold text-base text-[#140f08] hover:bg-[#f4d78a] sm:w-auto sm:px-10"
              onClick={submit}
              disabled={busy}
            >
              {busy ? "Opening both books…" : "Create — gas only"}
            </Button>
          </div>
        </div>

        <aside className="lg:pt-28">
          <div className="hairline sticky top-24 overflow-hidden rounded-3xl bg-card/80">
            <div className="relative h-56">
              <img src={image} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-card to-transparent" />
              <div className="absolute right-5 bottom-4 left-5">
                <p className="font-display text-3xl">{name || "Your coin"}</p>
                <p className="font-mono text-gold">${ticker || "TICKER"}</p>
              </div>
            </div>
            <div className="space-y-4 p-5">
              <p className="text-sm text-muted-foreground">
                Goal {formatUsd(goal)} · Opens now · Closes in {windowHours} hours
              </p>
              <ul className="space-y-3 text-sm">
                {CHAINS.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-xl bg-white/4 px-4 py-3"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: c.color }}
                      />
                      {c.name}
                    </span>
                    <span className="text-muted-foreground">{c.venue}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>01 You create. Name, ticker, picture, goal. Only gas.</li>
                <li>02 Backers send ETH or SOL straight to an address.</li>
                <li>03 Live on both chains within a minute.</li>
                <li>04 Half the raise becomes the bot&apos;s war chest.</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                {SITE.tagline} Demo mode — this launch is simulated in your
                browser.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
