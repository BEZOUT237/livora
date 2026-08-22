import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteShell, EmptyState } from "@/components/livora/SiteShell";
import { useCart } from "@/lib/cart";
import { useCurrency } from "@/lib/currency";
import { PUBLIC_DEFAULTS, shippingFor } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | LIVORA" },
      { name: "description", content: "Review the books in your LIVORA cart, apply a coupon and continue to secure checkout." },
      { property: "og:title", content: "Your Cart | LIVORA" },
      { property: "og:description", content: "Review your books and continue to secure checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, setQty, remove } = useCart();
  const { t } = useI18n();
  const { format } = useCurrency();
  const shipping = shippingFor(subtotal);
  const remaining = PUBLIC_DEFAULTS.freeShippingThreshold - subtotal;

  return (
    <SiteShell>
      <div className="container-livora py-10">
        <h1 className="text-3xl">{t("cart.title")}</h1>

        {lines.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title={t("cart.empty")}
              action={
                <Link to="/books" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
                  {t("cart.continue")}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
            <ul className="divide-y divide-border">
              {lines.map((l) => (
                <li key={l.bookId} className="flex gap-4 py-5">
                  <Link to="/books/$slug" params={{ slug: l.slug }} className="h-28 w-20 shrink-0 overflow-hidden rounded bg-ink">
                    {l.coverUrl ? (
                      <img src={l.coverUrl} alt={l.title} className="size-full object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center p-2 text-center font-serif text-[11px] text-ink-foreground">
                        {l.title}
                      </span>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link to="/books/$slug" params={{ slug: l.slug }} className="font-serif text-base hover:underline">
                      {l.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">{l.language}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <button className="px-2 py-1.5" onClick={() => setQty(l.bookId, l.quantity - 1)} aria-label="minus">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{l.quantity}</span>
                        <button className="px-2 py-1.5" onClick={() => setQty(l.bookId, l.quantity + 1)} aria-label="plus">
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button onClick={() => remove(l.bookId)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right text-sm font-bold">{format(l.price * l.quantity)}</div>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-panel">
              {remaining > 0 && (
                <p className="mb-4 rounded-md bg-accent/12 px-3 py-2 text-xs font-semibold">
                  {format(remaining)} {t("cart.freeShipHint")}
                </p>
              )}
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
                  <dd>{format(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
                  <dd>{shipping === 0 ? t("cart.free") : format(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                  <dt>{t("cart.total")}</dt>
                  <dd>{format(subtotal + shipping)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 block rounded-md bg-ink py-3 text-center text-sm font-bold text-ink-foreground"
              >
                {t("cart.checkout")}
              </Link>
              <Link to="/books" className="mt-3 block text-center text-xs underline">
                {t("cart.continue")}
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteShell>
  );
}
