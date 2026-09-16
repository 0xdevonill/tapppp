# Twins

**One coin. Two chains. One price.**

Twins is a premium twin-chain memecoin launchpad. You launch once. The coin goes live on **Robinhood Chain (PONS)** and **Solana (pump.fun)** in the same minute. Backers sit inside the first buy. A fee-funded bot keeps both prices within **4%**.

This repo is a full product demo of that flow — English, dark, built to feel live.

## What you can do

- Watch coins fund in real time with FOMO progress, countdowns, and a live ticker
- Open a coin and simulate backing with ETH (Robinhood / PONS) or SOL (pump.fun)
- Hit the goal and watch the dual-chain launch + peg bot come online
- Create your own twin with name, ticker, picture, goal, and window
- Read the full mechanics on [How it works](/how-it-works)

No real funds are collected. Addresses are demo-only.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127).

```bash
npm run build
npm start
```

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- shadcn/ui
- Simulated launch state in the browser (localStorage for coins you create)

## Protocol numbers (demo)

| | |
| --- | --- |
| Chains | Robinhood Chain · Solana |
| Venues | PONS · pump.fun |
| Minimum goal | $2,500 |
| Peg band | 4% |
| Trade fee | 3% (2% to the bot) |
| Create | gas only |

## API (demo)

- `GET /api/health`
- `GET /api/launches`
