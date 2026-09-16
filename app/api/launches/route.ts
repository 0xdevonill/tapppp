import { NextResponse } from "next/server";
import { SEED_COINS, gapPct } from "@/lib/coins";
import { SITE } from "@/lib/constants";

export function GET() {
  return NextResponse.json({
    protocol: SITE.name,
    tagline: SITE.tagline,
    launches: SEED_COINS.map((c) => ({
      slug: c.slug,
      name: c.name,
      ticker: c.ticker,
      status: c.status,
      goalUsd: c.goalUsd,
      raisedUsd: c.raisedUsd,
      backers: c.backers.length,
      mcapRobinhood: c.mcapRobinhood ?? null,
      mcapSolana: c.mcapSolana ?? null,
      gapPct: c.status === "live" ? Number(gapPct(c).toFixed(2)) : null,
    })),
  });
}
