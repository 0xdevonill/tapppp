"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/format";

export function Countdown({ to, className }: { to: string; className?: string }) {
  const [label, setLabel] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(Date.parse(to) - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [to]);

  return (
    <span className={`font-mono tabular-nums ${className ?? ""}`}>{label}</span>
  );
}
