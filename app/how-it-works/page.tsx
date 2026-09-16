import { AppShell } from "@/components/app-shell";
import { CHAINS, SITE } from "@/lib/constants";
import { formatUsd } from "@/lib/format";

export default function HowItWorksPage() {
  return (
    <AppShell>
      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Docs</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">
          How Twins works.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Everything a launcher or a backer needs: the money flow, the launch
          itself, the bot that holds the price, the fees. Same numbers as the
          product.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Chip>{formatUsd(SITE.minGoal)} minimum goal</Chip>
          <Chip>{SITE.maxGapPct}% maximum gap</Chip>
          <Chip>
            {SITE.tradeFeePct}% trade fee, {SITE.botFeePct}% funds the bot
          </Chip>
          <Chip>{SITE.launchMinutes} minute from goal to live</Chip>
        </div>

        <Section title="Overview">
          <p>
            Twins launches one memecoin on two chains at the same time:
            Robinhood Chain via PONS, and Solana via pump.fun. The two tokens
            share a name, a ticker, a picture and an opening price. After launch
            a bot funded by trading fees keeps the two market caps within{" "}
            {SITE.maxGapPct}% of each other.
          </p>
          <p>
            A launch is community funded. The creator sets a goal in dollars,
            backers send ETH or SOL to plain addresses, and the coin is created
            the moment the goal is reached. Backers are inside the very first
            buy on every chain, so nobody can get in before them.
          </p>
          <ul className="mt-4 space-y-2">
            {CHAINS.map((c) => (
              <li key={c.id}>
                <span className="text-foreground">
                  {c.name} · {c.venue}.
                </span>{" "}
                You send {c.asset}. Coins are delivered on this chain, in the
                launch transaction itself.
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Launching a coin">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              Connect a wallet. Creating costs only gas — there is no listing
              fee up front.
            </li>
            <li>
              Name, ticker, picture. Up to 32 characters, up to 10 characters,
              under 4 MB. The picture is pinned and used on both chains.
            </li>
            <li>
              Goal and window. A goal from {formatUsd(SITE.minGoal)} and a
              window between 6 hours and 7 days. Presets show the opening market
              cap they give.
            </li>
            <li>
              Share the two addresses. The coin&apos;s page shows progress,
              backers and pending transfers in real time.
            </li>
          </ol>
          <p className="mt-4">
            Even start. Both chains open at exactly the same price from the
            first second. If they drift, the bot levels them out.
          </p>
        </Section>

        <Section title="Backing a coin">
          <p>
            There is no app to install and nothing to sign. Send ETH or SOL from
            your own wallet to the address shown for that chain. The minimum is
            about $3.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>
              Anything above what is left of the goal is refunded to the sender
              automatically.
            </li>
            <li>
              Once the goal is hit, new transfers are rejected or returned.
            </li>
            <li>
              Your coins arrive on the chain you paid from, in the launch
              transaction itself.
            </li>
            <li>
              Send from your own wallet. Exchanges are not supported as senders,
              because the coins are delivered to the wallet that paid.
            </li>
          </ul>
        </Section>

        <Section title="Where the money goes">
          <p>When the goal is reached, the raise is split in a fixed way.</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <Row
              k="Launch fees"
              v="The fixed cost of creating on two chains. Gas and venue fees, usually a few dollars, shown live on the launch page."
            />
            <Row
              k="Half of the rest: the backers' coins"
              v="Bought at the opening price in the launch transaction on each chain, in proportion to what each backer put in."
            />
            <Row
              k="The other half: the bot's war chest"
              v="Split across both chains as coins and cash, so it can push a price up or pull it down."
            />
          </div>
        </Section>

        <Section title="The launch">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              Goal reached. Funding closes. New transfers are rejected or
              returned.
            </li>
            <li>
              Fresh wallets. One launch wallet per chain and one bot wallet per
              chain, all derived for this launch and never used before. Nobody
              can watch a deployer address and front-run it.
            </li>
            <li>
              Create and first buy, atomically. On every chain the coin is
              created and the first buy is made in one transaction.
            </li>
            <li>
              Coins delivered. Each backer&apos;s coins land in the wallet they
              paid from, on the chain they paid from.
            </li>
            <li>Gas swept. Leftover gas is swept back. Every hash is linked.</li>
          </ol>
        </Section>

        <Section title="The price-keeping bot">
          <p>
            The bot watches the two market caps and trades whenever they drift
            apart. Robinhood Chain is the reference. When Solana is cheaper the
            bot buys there; when it is dearer the bot sells there. Every trade,
            its reason and the bot&apos;s inventory are shown on the coin&apos;s
            page.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
            <Row
              k="Target"
              v={`The two market caps within ${SITE.maxGapPct}% of each other`}
            />
            <Row k="Above $100,000" v="The band tightens further" />
            <Row
              k="Per trade"
              v="Closes half the gap, capped at $500, never below its reserve"
            />
            <Row
              k="Inventory"
              v="About half of each chain's holding as coins and half as cash"
            />
            <Row
              k="Wallets"
              v="Its own on every chain, for this coin only. No coin ever trades with another coin's money"
            />
            <Row
              k="Funding"
              v={`Half the raise at launch, then ${SITE.botFeePct}% of every trade afterwards`}
            />
          </div>
        </Section>

        <Section title="If something fails">
          <p>
            Goal missed: if the window closes before the goal is reached, every
            backer is refunded automatically to the wallet they paid from, on
            the chain they paid from.
          </p>
          <p className="mt-3">
            One chain fails at launch: the backers of that chain get their share
            back. The other chain proceeds. The coin&apos;s page shows the failed
            leg.
          </p>
        </Section>

        <Section title="Fees">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <Row k="Creating" v="Only gas" />
            <Row k="Launching" v="The fixed launch cost, taken from the raise" />
            <Row
              k="Trading"
              v={`${SITE.tradeFeePct}% on every trade on any chain. ${SITE.botFeePct}% of it is routed to the bot's war chest`}
            />
            <Row
              k="Backing"
              v="Nothing beyond the network fee of your own transfer"
            />
          </div>
        </Section>

        <Section title="Chains and venues">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-4 gap-2 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <span>Chain</span>
              <span>Venue</span>
              <span>You send</span>
              <span>Role</span>
            </div>
            {CHAINS.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-1 gap-1 border-t border-white/8 px-4 py-3 text-sm sm:grid-cols-4"
              >
                <span>{c.name}</span>
                <span>{c.venue}</span>
                <span>{c.asset}</span>
                <span className="text-muted-foreground">
                  {c.id === "robinhood"
                    ? "Reference chain. Funding and refunds settle here."
                    : "Bridged for credit. Coins delivered on Solana."}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="This demo">
          <p>
            The live site you are looking at is a full product demo: launches,
            backing and the peg bot are simulated in your browser. No real ETH
            or SOL is ever collected. When Twins is wired to PONS and pump.fun,
            the flow above is the contract.
          </p>
        </Section>
      </article>
    </AppShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1">
      {children}
    </span>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 border-t border-white/8 px-4 py-3 first:border-t-0 sm:grid-cols-[220px_1fr]">
      <p className="text-sm text-foreground">{k}</p>
      <p className="text-sm text-muted-foreground">{v}</p>
    </div>
  );
}
