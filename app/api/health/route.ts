import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    relayer: "twins-demo",
    chains: ["robinhood", "solana"],
    venues: ["PONS", "pump.fun"],
  });
}
