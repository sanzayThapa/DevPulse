import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMetric(value: number, unit: "number" | "currency" | "percent") {
  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  if (unit === "percent") {
    return `${value.toFixed(value < 10 ? 2 : 1)}%`;
  }

  return new Intl.NumberFormat("en-US", { notation: value > 99999 ? "compact" : "standard" }).format(value);
}

export function jitter(value: number, intensity = 0.06, min = 0) {
  const offset = value * intensity * (Math.random() - 0.5);
  return Math.max(min, Math.round(value + offset));
}

export function percentageJitter(value: number, intensity = 0.1) {
  const next = value + value * intensity * (Math.random() - 0.5);
  return Math.max(0, Number(next.toFixed(2)));
}
