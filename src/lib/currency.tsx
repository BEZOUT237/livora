import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Currency = "TRY" | "USD" | "EUR";

const RATES: Record<Currency, number> = { TRY: 1, USD: 0.024, EUR: 0.022 };
const LOCALES: Record<Currency, string> = { TRY: "tr-TR", USD: "en-US", EUR: "de-DE" };
const STORAGE_KEY = "livora.currency";

export function formatCurrency(value: number | string | null | undefined, currency: Currency): string {
  return new Intl.NumberFormat(LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (tryAmount: number) => number;
  format: (tryAmount: number | string | null | undefined) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("TRY");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "TRY" || stored === "USD" || stored === "EUR") setCurrencyState(stored);
  }, []);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency: (next) => {
        setCurrencyState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      convert: (tryAmount) => Number(tryAmount || 0) * RATES[currency],
      format: (tryAmount) => formatCurrency(Number(tryAmount || 0) * RATES[currency], currency),
    }),
    [currency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used inside CurrencyProvider");
  return context;
}
