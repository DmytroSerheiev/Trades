// ------------------- HyperLiquid -------------------

export enum Chain {
  ArbitrumTestnet = 'ArbitrumTestnet',
  Arbitrum = 'Arbitrum',
}

export enum ChainId {
  ArbitrumTestnet = 421614,
  Arbitrum = 42161,
}

export type OrderType =
  | {
      limit: {
        tif: 'Gtc' | 'Ioc' | 'Alo' | 'FrontendMarket';
      };
    }
  | {
      trigger: {
        triggerPx: string;
        isMarket: boolean;
        tpsl: 'tp' | 'sl';
      };
    };

export type Cancel = {
  asset: number;
  oid: number;
};

export type OrderRequest = {
  asset: number;
  isBuy: boolean;
  limitPx: number | string;
  sz: number | string;
  reduceOnly: boolean;
  orderType: OrderType;
  cloid?: string | null;
};

export type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

export type CandleSnapshot = {
  coin: string;
  endTime: number;
  interval: Interval;
  startTime: number;
};

export interface Meta {
  universe: Universe[];
}

export interface Universe {
  szDecimals: number;
  name: string;
  maxLeverage: number;
  onlyIsolated: boolean;
}

export interface AssetCtx {
  funding: string;
  openInterest: string;
  prevDayPx: string;
  dayNtlVlm: string;
  premium: string;
  oraclePx: string;
  markPx: string;
  midPx: string;
  impactPxs: string[];
}

// ------------------- Info -------------------

export interface AccountProps {
  name: string;
  address: string | any;
  equity: number | any;
}

export interface SubAccount {
  clearinghouseState: ClearinghouseState;
  master: String;
  name: string;
  subAccountUser: string;
}

export interface ClearinghouseState {
  assetPositions: any[];
  marginSummary: MarginSummary;
  crossMarginSummary: MarginSummary;
  withdrawable: string;
  time: number;
  crossMaintenanceMarginUsed: string;
}

export interface MarginSummary {
  accountValue: string;
  totalMarginUsed: string;
  totalNtlPos: string;
  totalRawUsd: string;
}

// ------------------- OrderBook -------------------
export interface tokenPairs {
  token1: string;
  token2: string;
}

export interface PairData {
  pairs?: string;
  assetId?: string | number;
  assetctxs: AssetCtx;
  universe: Universe;
}

export interface BookDataProps {
  asks: { px: number; sz: number; n: number }[];
  bids: { px: number; sz: number; n: number }[];
}

// ------------------- Websocket -------------------
export interface WsTrades {
  coin: string;
  side: string;
  px: string;
  sz: string;
  hash: string;
  time: number;
  tid: number; // ID unique across all assets
}

export interface PositionsData {
  Coin: string;
  Size: number;
  PositionValue: number;
  EntryPrice: number;
  MarkPrice: number;
  PNL: {
    Amount: number;
    ROE: string; // Percentage
  };
  LiqPrice: number;
  Margin: number;
  Funding: number;
  TP_SL: {
    TakeProfit: number | null;
    StopLoss: number | null;
  };
}

export interface OpenOrders {
  Time: string; // You can use Date type if you prefer
  Type: 'Buy' | 'Sell'; // Type of order
  Coin: string; // Name of the coin
  Direction: 'Long' | 'Short'; // Direction of the order
  Size: number; // Size of the order
  OriginalPrice: number; // Original price set for the order
  OrderValue: number; // Total value of the order
  Price: number; // Current price of the order
  TriggerCondition: string; // Trigger condition for the order
  TP_SL: {
    TakeProfit: number | null;
    StopLoss: number | null;
  };
}

export interface Twap {
  Coin: string; // Name of the coin
  Size: number; // Total size of the order
  ExecutedSize: number; // Executed size of the order
  AveragePrice: number; // Average price of the order
  RunningTime_Total: string; // Running time / Total time
  ReduceOnly: boolean; // Indicates if the order is reduce-only
  CreationTime: string; // Time when the order was created
  Terminate: string | null; // Time when the order will terminate or null if not terminated
}

export interface TradeHistory {
  Time: string; // Time of the trade
  Coin: string; // Name of the coin
  Direction: 'Buy' | 'Sell'; // Direction of the trade
  Price: number; // Price at which the trade was executed
  Size: number; // Size of the trade
  TradeValue: number; // Total value of the trade
  Fee: number; // Fee associated with the trade
  ClosedPNL: number; // Closed Profit and Loss of the trade
}

export interface FundingHistory {
  Time: string; // Time of the funding
  Coin: string; // Name of the coin
  Size: number; // Size of the funding
  Direction: 'Received' | 'Paid'; // Direction of the funding
  Payment: number; // Payment amount for the funding
  Rate: number; // Funding rate
}

export interface OrderHistory {
  Time: string; // Time of the order
  Type: 'Buy' | 'Sell'; // Type of the order
  Coin: string; // Name of the coin
  Direction: 'Long' | 'Short'; // Direction of the order
  Size: number; // Size of the order
  OriginalSize: number; // Original size of the order
  OrderValue: number; // Total value of the order
  Price: number; // Price at which the order was executed
  TriggerCondition: string; // Trigger condition for the order
  TP_SL: {
    TakeProfit: number | null;
    StopLoss: number | null;
  };
  Status: string; // Status of the order
}

export type AllWebData2 =
  | PositionsData
  | OpenOrders
  | Twap
  | TradeHistory
  | FundingHistory
  | OrderHistory;

export interface Leverage {
  type: string;
  value: number;
}

export interface ActiveAssetData {
  user: string;
  coin: string;
  leverage: Leverage;
  maxTradeSzs: string[];
  availableToTrade: string[];
}
