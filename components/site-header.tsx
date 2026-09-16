"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCoins } from "@/lib/store";
import { shorten } from "@/lib/format";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/coins", label: "Coins" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/launch", label: "Launch" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { wallet, connect, disconnect, coins } = useCoins();
  const [open, setOpen] = useState(false);
  const live = coins.filter((c) => c.status === "live").length;
  const funding = coins.filter((c) => c.status === "funding").length;

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07070b]/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/brand/logo.png"
            alt="Twins"
            width={32}
            height={32}
            className="size-8 rounded-full ring-1 ring-gold/40"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            TWINS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "bg-white/6 text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <span className="pulse-dot size-1.5 rounded-full bg-lime" />
              {funding} funding
            </span>
            <span className="text-white/20">/</span>
            <span>{live} live</span>
          </div>
          {wallet ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-gold/30 bg-gold/10 px-3 text-gold"
              onClick={disconnect}
            >
              <Wallet className="size-3.5" />
              {shorten(wallet, 4, 3)}
            </Button>
          ) : (
            <Button
              size="sm"
              className="hidden h-8 rounded-full bg-gold px-3.5 text-[#140f08] hover:bg-[#f4d78a] sm:inline-flex"
              onClick={connect}
            >
              Connect wallet
            </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              nativeButton={false}
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#0c0c10]">
              <div className="mt-8 flex flex-col gap-2">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-lg hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                {!wallet && (
                  <Button className="mt-4 h-11 rounded-full bg-gold text-[#140f08]" onClick={connect}>
                    Connect wallet
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
