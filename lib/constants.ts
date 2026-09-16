import type { ChainMeta } from "@/lib/types";

export const SITE = {
  name: "Twins",
  tagline: "One coin. Two chains. One price.",
  description:
    "Launch once and your coin goes live on Robinhood Chain and Solana in the same minute. Backers sit inside the first buy. A fee-funded bot keeps both prices within 4%.",
  url: "https://twins.trade",
  minGoal: 2500,
  maxGapPct: 4,
  tradeFeePct: 3,
  botFeePct: 2,
  launchMinutes: 1,
};

export const CHAINS: ChainMeta[] = [
  {
    id: "robinhood",
    name: "Robinhood Chain",
    short: "Hood",
    venue: "PONS",
    venueUrl: "https://pons.family",
    asset: "ETH",
    assetFull: "Ether",
    color: "#D4FF00",
    glow: "rgba(212, 255, 0, 0.35)",
  },
  {
    id: "solana",
    name: "Solana",
    short: "Sol",
    venue: "pump.fun",
    venueUrl: "https://pump.fun",
    asset: "SOL",
    assetFull: "Solana",
    color: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.4)",
  },
];

export const GOAL_PRESETS = [2500, 5000, 10000, 25000] as const;

export const WINDOW_PRESETS = [
  { label: "6 hours", hours: 6 },
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "7 days", hours: 168 },
] as const;

export function chainById(id: ChainMeta["id"]) {
  return CHAINS.find((c) => c.id === id)!;
}
