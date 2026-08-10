import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  bookId: string;
  slug: string;
  title: string;
  coverUrl: string | null;
  price: number;
  language: string;
  quantity: number;
  maxQty: number;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, qty?: number) => void;
  setQty: (bookId: string, qty: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "livora.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const value = useMemo<Ctx>(() => {
    return {
      lines,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.quantity * l.price, 0),
      add: (line, qty = 1) =>
        setLines((prev) => {
          const found = prev.find((l) => l.bookId === line.bookId);
          if (found) {
            const cap = Math.max(1, line.maxQty || 99);
            return prev.map((l) =>
              l.bookId === line.bookId ? { ...l, quantity: Math.min(cap, l.quantity + qty) } : l,
            );
          }
          return [...prev, { ...line, quantity: qty }];
        }),
      setQty: (bookId, qty) =>
        setLines((prev) =>
          prev
            .map((l) => (l.bookId === bookId ? { ...l, quantity: Math.max(0, Math.min(l.maxQty || 99, qty)) } : l))
            .filter((l) => l.quantity > 0),
        ),
      remove: (bookId) => setLines((prev) => prev.filter((l) => l.bookId !== bookId)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
