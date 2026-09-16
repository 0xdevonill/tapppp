const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatUsd(n: number, exact = false) {
  return (exact ? usdExact : usd).format(n);
}

export function formatCompactUsd(n: number) {
  return compact.format(n);
}

export function formatPct(n: number, digits = 1) {
  return `${n.toFixed(digits)}%`;
}

export function shorten(address: string, head = 4, tail = 4) {
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function progressPct(raised: number, goal: number) {
  if (goal <= 0) return 0;
  return clamp((raised / goal) * 100, 0, 100);
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00:00";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (v: number) => v.toString().padStart(2, "0");
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${pad(h % 24)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function demoAddress(chain: "robinhood" | "solana", slug: string) {
  const tag = slug.replace(/[^a-z0-9]/gi, "").slice(0, 10).toUpperCase();
  if (chain === "robinhood") {
    return `0xDEMO000000000000000000${tag.padEnd(10, "0")}`;
  }
  return `TwinsDemo${tag.padEnd(12, "1")}Sol`;
}
