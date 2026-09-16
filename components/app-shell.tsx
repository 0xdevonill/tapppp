import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-b border-gold/15 bg-gold/[0.07] px-4 py-2 text-center text-[11px] tracking-wide text-gold">
        Product demo with simulated launches. Do not send real ETH or SOL — no
        funds are collected.{" "}
        <Link href="/how-it-works" className="underline underline-offset-2">
          Read how it works
        </Link>
      </div>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
