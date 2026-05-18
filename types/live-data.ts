export type ApiStatus = "idle" | "loading" | "success" | "error";

export type PublicApiState<TData> = {
  data: TData | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
  status: ApiStatus;
  refetch: () => void;
};

export type CryptoAssetId = "bitcoin" | "ethereum" | "solana";

export type CryptoAsset = {
  id: CryptoAssetId;
  name: string;
  symbol: string;
  priceUsd: number;
  change24h: number;
  marketCapUsd: number;
  lastUpdatedAt: number;
};

export type CryptoHistoryPoint = {
  time: string;
  Bitcoin: number;
  Ethereum: number;
  Solana: number;
};

export type LiveCryptoData = {
  assets: CryptoAsset[];
  totalMarketCapUsd: number;
  averageChange24h: number;
  strongestAsset: CryptoAsset;
  history: CryptoHistoryPoint[];
};

export type CoinGeckoSimplePriceResponse = Record<
  CryptoAssetId,
  {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    last_updated_at: number;
  }
>;
