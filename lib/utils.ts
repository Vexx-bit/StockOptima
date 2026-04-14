import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency configuration with Kenya as priority
export const CURRENCIES = {
  KES: { symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE" },
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "en-EU" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

// Get currency from localStorage or default to KES (Kenya)
export function getCurrentCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "KES";
  return (localStorage.getItem("currency") as CurrencyCode) || "KES";
}

// Set currency preference
export function setCurrency(currency: CurrencyCode) {
  if (typeof window !== "undefined") {
    localStorage.setItem("currency", currency);
  }
}

// Format currency based on selected currency
export function formatCurrency(amount: number | string, currencyCode?: CurrencyCode): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const currency = currencyCode || getCurrentCurrency();
  const config = CURRENCIES[currency];
  
  // For Kenya, use custom formatting
  if (currency === "KES") {
    return `${config.symbol} ${num.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  
  // For other currencies, use standard formatting
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

// Format date (Kenya timezone)
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Get or set organization name
export function getOrganizationName(): string {
  if (typeof window === "undefined") return "StockOptima";
  return localStorage.getItem("organizationName") || "StockOptima";
}

export function setOrganizationName(name: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("organizationName", name);
    // Dispatch event for components to update
    window.dispatchEvent(new Event("organizationNameChanged"));
  }
}
