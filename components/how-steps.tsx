import { CHAINS } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Create",
    body: "Name, ticker, logo, a soft cap from $2,500. One minute. Only gas.",
  },
  {
    n: "02",
    title: "Backers send money",
    body: "ETH on Robinhood Chain or SOL on Solana, straight to an address. Overpayments bounce back. No app. No signing.",
  },
  {
    n: "03",
    title: "It launches",
    body: "Soft cap hit. The coin is created on PONS and pump.fun in the same minute, from wallets nobody has seen before. Backers are the first buy on both chains.",
  },
  {
    n: "04",
    title: "A bot holds the peg",
    body: "Every trade pays 3%. 2% funds a bot that buys the cheap chain and sells the dear one, around the clock, inside a 4% band.",
  },
];

export function HowSteps() {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {STEPS.map((step) => (
        <li
          key={step.n}
          className="panel relative overflow-hidden p-6"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-gold">{step.n}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.body}
          </p>
        </li>
      ))}
      <li className="md:col-span-2 flex flex-wrap gap-3 pt-2">
        {CHAINS.map((c) => (
          <a
            key={c.id}
            href={c.venueUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm hover:border-gold/40"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: c.color }}
            />
            {c.name} launches on {c.venue} ↗
          </a>
        ))}
      </li>
    </ol>
  );
}
