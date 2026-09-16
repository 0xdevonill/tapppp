import { AppShell } from "@/components/app-shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          This twin never launched.
        </h1>
        <p className="mt-3 text-muted-foreground">
          No coin with that ticker is on the book. Back something that still has
          room, or create the next one.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button render={<Link href="/coins" />} className="h-11 rounded-full bg-gold px-6 text-[#140f08]">
            See coins
          </Button>
          <Button render={<Link href="/launch" />} variant="outline" className="h-11 rounded-full px-6">
            Launch
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
