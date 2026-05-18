"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PublicApiState } from "@/types/live-data";

type UsePollingApiOptions<TResponse, TData> = {
  url: string;
  refreshMs?: number;
  select: (response: TResponse) => TData;
  enabled?: boolean;
};

export function usePollingApi<TResponse, TData>({
  url,
  refreshMs = 30000,
  select,
  enabled = true
}: UsePollingApiOptions<TResponse, TData>): PublicApiState<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const dataRef = useRef<TData | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    setIsLoading((current) => current && dataRef.current === null);
    setIsRefreshing(dataRef.current !== null);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`API request failed with ${response.status}`);
      }

      const json = (await response.json()) as TResponse;
      const nextData = select(json);
      dataRef.current = nextData;
      setData(nextData);
      setLastUpdated(new Date());
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") return;
      setError(requestError instanceof Error ? requestError.message : "Unable to load live data");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [enabled, select, url]);

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(fetchData, refreshMs);

    return () => {
      window.clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData, refreshMs]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    lastUpdated,
    status: error ? "error" : data ? "success" : isLoading ? "loading" : "idle",
    refetch: fetchData
  };
}
