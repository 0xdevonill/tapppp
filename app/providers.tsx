"use client";

import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CoinsProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider delay={120}>
        <CoinsProvider>
          {children}
          <Toaster position="bottom-right" theme="dark" />
        </CoinsProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
