"use client";

import { useCallback, useMemo, useState } from "react";
import { usePollingApi } from "@/hooks/use-polling-api";
import type {
  CoinGeckoSimplePriceResponse,
  CryptoAsset,
  CryptoAssetId,
  CryptoHistoryPoint,
  LiveCryptoData
} from "@/types/live-data";

type CryptoChartKey = Exclude<keyof CryptoHistoryPoint, "time">;

const assetMeta: Record<CryptoAssetId, { name: string; symbol: string; chartKey: CryptoChartKey }> = {
  bitcoin: { name: "Bitcoin", symbol: "BTC", chartKey: "Bitcoin" },
  ethereum: { name: "Ethereum", symbol: "ETH", chartKey: "Ethereum" },
  solana: { name: "Solana", symbol: "SOL", chartKey: "Solana" }
};

const cryptoIds = Object.keys(assetMeta) as CryptoAssetId[];

function toAssets(response: CoinGeckoSimplePriceResponse): CryptoAsset[] {
  return cryptoIds.map((id) => ({
    id,
    name: assetMeta[id].name,
    symbol: assetMeta[id].symbol,
    priceUsd: response[id].usd,
    change24h: response[id].usd_24h_change,
    marketCapUsd: response[id].usd_market_cap,
    lastUpdatedAt: response[id].last_updated_at
  }));
}

function makeHistoryPoint(assets: CryptoAsset[]): CryptoHistoryPoint {
  const point: CryptoHistoryPoint = {
    time: new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()),
    Bitcoin: 0,
    Ethereum: 0,
    Solana: 0
  };

  assets.forEach((asset) => {
    point[assetMeta[asset.id].chartKey] = Number(asset.priceUsd.toFixed(asset.id === "solana" ? 2 : 0));
  });

  return point;
}

export function useLiveCryptoPrices(refreshMs = 30000) {
  const [history, setHistory] = useState<CryptoHistoryPoint[]>([]);
  const url = useMemo(
    () =>
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_last_updated_at=true",
    []
  );

  const select = useCallback((response: CoinGeckoSimplePriceResponse): LiveCryptoData => {
    const assets = toAssets(response);
    const totalMarketCapUsd = assets.reduce((sum, asset) => sum + asset.marketCapUsd, 0);
    const averageChange24h = assets.reduce((sum, asset) => sum + asset.change24h, 0) / assets.length;
    const strongestAsset = assets.reduce((best, asset) => (asset.change24h > best.change24h ? asset : best), assets[0]);
    const nextPoint = makeHistoryPoint(assets);

    setHistory((current) => [...current.slice(-7), nextPoint]);

    return {
      assets,
      totalMarketCapUsd,
      averageChange24h,
      strongestAsset,
      history: []
    };
  }, []);

  const state = usePollingApi<CoinGeckoSimplePriceResponse, LiveCryptoData>({
    url,
    refreshMs,
    select
  });

  return {
    ...state,
    data: state.data ? { ...state.data, history } : null
  };
}
