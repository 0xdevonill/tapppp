"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CoinCard } from "@/components/coin-card";
import { Eyebrow } from "@/components/ui-bits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoins } from "@/lib/store";

export default function CoinsPage() {
  const { coins } = useCoins();
  const funding = coins.filter(
    (c) => c.status === "funding" || c.status === "launching"
  );
  const live = coins.filter((c) => c.status === "live");

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Eyebrow>Market</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
          Every coin, both chains.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Soft caps filling right now, and twins already live on Robinhood Chain
          and Solana. Open one for the logo, the cap, the bot&apos;s trades and
          every backer.
        </p>

        <Tabs defaultValue="all" className="mt-10">
          <TabsList className="h-10 rounded-full bg-white/5 px-1">
            <TabsTrigger value="all">All ({coins.length})</TabsTrigger>
            <TabsTrigger value="funding">Funding ({funding.length})</TabsTrigger>
            <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-8">
            <Grid coins={coins} />
          </TabsContent>
          <TabsContent value="funding" className="mt-8">
            {funding.length === 0 ? (
              <Empty label="Nothing is funding. Launch the next one." />
            ) : (
              <Grid coins={funding} />
            )}
          </TabsContent>
          <TabsContent value="live" className="mt-8">
            {live.length === 0 ? (
              <Empty label="No live twins yet. Back a coin and watch it pop." />
            ) : (
              <Grid coins={live} />
            )}
          </TabsContent>
        </Tabs>
      </section>
    </AppShell>
  );
}

function Grid({ coins }: { coins: ReturnType<typeof useCoins>["coins"] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {coins.map((coin) => (
        <CoinCard key={coin.slug} coin={coin} />
      ))}
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="panel rounded-2xl px-6 py-16 text-center">
      <p className="text-muted-foreground">{label}</p>
      <Link href="/launch" className="mt-3 inline-block text-gold">
        Launch a twin
      </Link>
    </div>
  );
}
