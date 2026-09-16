import Image from "next/image";
import Link from "next/link";
import { CHAINS, SITE } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image src="/brand/logo.png" alt="" width={32} height={32} className="size-8 rounded-full ring-1 ring-gold/40" />
            <span className="font-display text-lg font-semibold">TWINS</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {SITE.tagline} A twin-chain launchpad for Robinhood Chain and
            Solana. Backers inside the first buy. A bot that holds the peg.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
            Product
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/coins" className="hover:text-gold">
                Live coins
              </Link>
            </li>
            <li>
              <Link href="/launch" className="hover:text-gold">
                Launch a coin
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-gold">
                How Twins works
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold">
            Venues
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {CHAINS.map((c) => (
              <li key={c.id}>
                <a
                  href={c.venueUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold"
                >
                  {c.name} · {c.venue}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Demo product. Simulated launches — never send real funds.</p>
          <p>© {new Date().getFullYear()} Twins. One coin, two chains.</p>
        </div>
      </div>
    </footer>
  );
}
