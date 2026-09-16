"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SEED_COINS } from "@/lib/coins";
import { demoAddress } from "@/lib/format";
import type { ChainId, Coin } from "@/lib/types";

const CUSTOM_KEY = "twins.custom-coins";
const WALLET_KEY = "twins.demo-wallet";

type CreateInput = {
  name: string;
  ticker: string;
  image: string;
  blurb: string;
  goalUsd: number;
  windowHours: number;
};

type CoinsContextValue = {
  coins: Coin[];
  hydrated: boolean;
  wallet: string | null;
  connect: () => void;
  disconnect: () => void;
  createCoin: (input: CreateInput) => Coin;
  backCoin: (slug: string, chain: ChainId, usd: number) => Coin | null;
  getCoin: (slug: string) => Coin | undefined;
};

const CoinsContext = createContext<CoinsContextValue | null>(null);

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24);
}

export function CoinsProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState<Coin[]>(SEED_COINS);
  const [wallet, setWallet] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(CUSTOM_KEY);
        if (raw) {
          const custom = JSON.parse(raw) as Coin[];
          setCoins((prev) => {
            const slugs = new Set(prev.map((c) => c.slug));
            return [...custom.filter((c) => !slugs.has(c.slug)), ...prev];
          });
        }
        const w = localStorage.getItem(WALLET_KEY);
        if (w) setWallet(w);
      } catch {
        /* ignore */
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const custom = coins.filter(
      (c) => !SEED_COINS.some((s) => s.slug === c.slug)
    );
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [coins, hydrated]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCoins((prev) =>
        prev.map((coin) => {
          if (coin.status !== "funding") return coin;
          const bump = (coin.raisePerMinute ?? 10) * (0.4 + Math.random() * 0.8) * 0.04;
          const next = Math.min(coin.goalUsd * 0.985, coin.raisedUsd + bump);
          if (next === coin.raisedUsd) return coin;
          return { ...coin, raisedUsd: next };
        })
      );
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const connect = useCallback(() => {
    const fake = "0x7a3f9c21d8b44e0aa19c2e1";
    setWallet(fake);
    localStorage.setItem(WALLET_KEY, fake);
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    localStorage.removeItem(WALLET_KEY);
  }, []);

  const createCoin = useCallback((input: CreateInput) => {
    const base = slugify(input.name) || "twin";
    const slug = coins.some((c) => c.slug === base)
      ? `${base}-${Math.floor(Math.random() * 90 + 10)}`
      : base;
    const now = Date.now();
    const coin: Coin = {
      slug,
      name: input.name.trim(),
      ticker: input.ticker.trim().toUpperCase(),
      image: input.image,
      blurb: input.blurb.trim() || "A twin-chain launch. Backers inside the first buy.",
      goalUsd: input.goalUsd,
      raisedUsd: 0,
      status: "funding",
      openedAt: new Date(now).toISOString(),
      closesAt: new Date(now + input.windowHours * 3600 * 1000).toISOString(),
      hot: true,
      raisePerMinute: 0,
      backers: [],
      botTrades: [],
    };
    setCoins((prev) => [coin, ...prev]);
    return coin;
  }, [coins]);

  const backCoin = useCallback(
    (slug: string, chain: ChainId, usd: number) => {
      let result: Coin | null = null;
      setCoins((prev) => {
        const current = prev.find((c) => c.slug === slug);
        if (!current || current.status !== "funding") return prev;
        const remaining = Math.max(0, current.goalUsd - current.raisedUsd);
        const credited = Math.min(remaining, usd);
        if (credited <= 0) return prev;
        const nextRaised = current.raisedUsd + credited;
        const hit = nextRaised >= current.goalUsd;
        const next: Coin = {
          ...current,
          raisedUsd: nextRaised,
          backers: [
            {
              id: `${slug}-${Date.now()}`,
              chain,
              wallet: wallet ?? demoAddress(chain, "you"),
              amountUsd: credited,
              amountAsset:
                chain === "solana" ? credited / 306 : credited / 3050,
              at: new Date().toISOString(),
            },
            ...current.backers,
          ],
          status: hit ? "launching" : "funding",
          launchedAt: hit ? new Date().toISOString() : current.launchedAt,
        };
        result = next;
        return prev.map((c) => (c.slug === slug ? next : c));
      });
      return result;
    },
    [wallet]
  );

  useEffect(() => {
    const launching = coins.filter((c) => c.status === "launching");
    if (launching.length === 0) return;
    const t = window.setTimeout(() => {
      setCoins((prev) =>
        prev.map((c) => {
          if (c.status !== "launching") return c;
          const mcap = c.goalUsd * 42;
          return {
            ...c,
            status: "live",
            mcapRobinhood: mcap * 1.01,
            mcapSolana: mcap * 0.99,
            volume24h: c.goalUsd * 3.2,
            botChestUsd: c.goalUsd * 0.5,
            botTrades: [
              {
                id: `${c.slug}-open`,
                action: "buy",
                chain: "solana",
                usd: 90,
                gapFrom: 3.2,
                gapTo: 1.1,
                at: new Date().toISOString(),
              },
            ],
          };
        })
      );
    }, 2800);
    return () => window.clearTimeout(t);
  }, [coins]);

  const getCoin = useCallback(
    (slug: string) => coins.find((c) => c.slug === slug),
    [coins]
  );

  const value = useMemo(
    () => ({
      coins,
      hydrated,
      wallet,
      connect,
      disconnect,
      createCoin,
      backCoin,
      getCoin,
    }),
    [coins, hydrated, wallet, connect, disconnect, createCoin, backCoin, getCoin]
  );

  return <CoinsContext.Provider value={value}>{children}</CoinsContext.Provider>;
}

export function useCoins() {
  const ctx = useContext(CoinsContext);
  if (!ctx) throw new Error("useCoins must be used inside CoinsProvider");
  return ctx;
}
