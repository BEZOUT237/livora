export function formatTRY(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 }).format(n);
}

export function formatNumber(value: number | string | null | undefined): string {
  return new Intl.NumberFormat("tr-TR").format(Number(value ?? 0));
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function pct(value: number): string {
  return `${(Math.round(value * 10) / 10).toFixed(1)}%`;
}

/** Landed cost in TRY for one unit. */
export function landedCost(b: {
  purchase_cost: number | string;
  purchase_fx_rate: number | string;
  shipping_cost: number | string;
  customs_cost: number | string;
  packaging_cost: number | string;
}): number {
  return (
    Number(b.purchase_cost) * Number(b.purchase_fx_rate) +
    Number(b.shipping_cost) +
    Number(b.customs_cost) +
    Number(b.packaging_cost)
  );
}

/** Contribution margin in TRY after landed cost and payment fees. */
export function contributionMargin(price: number, landed: number, paymentFeePct = 2.9): number {
  return price - landed - (price * paymentFeePct) / 100;
}

export function marginPct(price: number, landed: number, paymentFeePct = 2.9): number {
  if (!price) return 0;
  return (contributionMargin(price, landed, paymentFeePct) / price) * 100;
}

/** Lowest price that still respects the configured minimum margin. */
export function minProfitablePrice(landed: number, minMarginPct: number, paymentFeePct = 2.9): number {
  const denom = 1 - minMarginPct / 100 - paymentFeePct / 100;
  if (denom <= 0) return landed;
  return landed / denom;
}
