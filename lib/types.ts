export type ChainId = "robinhood" | "solana";
export type CoinStatus = "funding" | "launching" | "live" | "missed";

export type ChainMeta = {
  id: ChainId;
  name: string;
  short: string;
  venue: string;
  venueUrl: string;
  asset: string;
  assetFull: string;
  color: string;
  glow: string;
};

export type Backer = {
  id: string;
  chain: ChainId;
  wallet: string;
  amountUsd: number;
  amountAsset: number;
  at: string;
};

export type BotTrade = {
  id: string;
  action: "buy" | "sell";
  chain: ChainId;
  usd: number;
  gapFrom: number;
  gapTo: number;
  at: string;
};

export type Coin = {
  slug: string;
  name: string;
  ticker: string;
  image: string;
  blurb: string;
  goalUsd: number;
  raisedUsd: number;
  status: CoinStatus;
  openedAt: string;
  closesAt: string;
  launchedAt?: string;
  backers: Backer[];
  botTrades: BotTrade[];
  mcapRobinhood?: number;
  mcapSolana?: number;
  volume24h?: number;
  botChestUsd?: number;
  featured?: boolean;
  hot?: boolean;
  raisePerMinute?: number;
};
