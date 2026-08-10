import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { SiteShell } from "@/components/livora/SiteShell";
import { useCart } from "@/lib/cart";
import { formatTRY } from "@/lib/format";
import { shippingFor } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | LIVORA" },
      { name: "description", content: "Complete your LIVORA order with secure, 3D Secure ready payment and delivery across Türkiye." },
      { property: "og:title", content: "Checkout | LIVORA" },
      { property: "og:description", content: "Secure checkout for English and French books delivered across Türkiye." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(60),
  district: z.string().trim().min(2).max(60),
  postal_code: z.string().trim().max(12).optional(),
  address_line: z.string().trim().min(8).max(400),
});

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { t } = useI18n();
  const { data: session } = useSession();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const shipping = shippingFor(subtotal);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    if (lines.length === 0) return;
    setBusy(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        ...parsed.data,
        postal_code: parsed.data.postal_code ?? null,
        user_id: session?.user.id ?? null,
        status: "pending_payment",
        payment_provider: "manual",
        payment_status: "pending",
        subtotal,
        shipping_total: shipping,
        total: subtotal + shipping,
      })
      .select("id,order_number")
      .single();

    if (error || !order) {
      setBusy(false);
      toast.error("We couldn't create your order. Please try again.");
      return;
    }

    await supabase.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        book_id: l.bookId,
        title: l.title,
        cover_url: l.coverUrl,
        unit_price: l.price,
        quantity: l.quantity,
        line_total: l.price * l.quantity,
      })),
    );

    clear();
    setBusy(false);
    setDone(order.order_number);
  };

  if (done) {
    return (
      <SiteShell>
        <div className="container-livora py-24 text-center">
          <h1 className="text-3xl">{t("checkout.success")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">Order #{done}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/account" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
              {t("account.orders")}
            </Link>
            <Link to="/books" className="rounded-full border border-ink px-5 py-2.5 text-sm font-bold">
              {t("cart.continue")}
            </Link>
          </div>
        </div>
      </SiteShell>
    );
  }

  if (lines.length === 0) {
    navigate({ to: "/cart" });
    return null;
  }

  const field = "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent";

  return (
    <SiteShell>
      <div className="container-livora grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="space-y-8">
          <h1 className="text-3xl">{t("checkout.title")}</h1>
          {!session && <p className="text-sm text-muted-foreground">{t("checkout.guest")}</p>}

          <fieldset className="space-y-3">
            <legend className="eyebrow mb-2">{t("checkout.contact")}</legend>
            <input name="full_name" placeholder="Ad Soyad" required maxLength={120} className={field} />
            <input name="email" type="email" placeholder="E-posta" required defaultValue={session?.user.email ?? ""} className={field} />
            <input name="phone" placeholder="Telefon" required maxLength={30} className={field} />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="eyebrow mb-2">{t("checkout.address")}</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <input name="city" placeholder="İl" required className={field} />
              <input name="district" placeholder="İlçe" required className={field} />
              <input name="postal_code" placeholder="Posta kodu" maxLength={12} className={field} />
            </div>
            <textarea name="address_line" placeholder="Adres" required rows={3} maxLength={400} className={field} />
          </fieldset>

          <fieldset>
            <legend className="eyebrow mb-2">{t("checkout.payment")}</legend>
            <p className="rounded-md border border-dashed border-border bg-secondary/60 p-4 text-xs text-muted-foreground">
              {t("checkout.sandbox")} The payment layer is provider-agnostic and ready for iyzico or PayTR with 3D Secure.
            </p>
          </fieldset>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-ink py-3.5 text-sm font-bold text-ink-foreground disabled:opacity-60"
          >
            {t("checkout.place")}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-panel">
          <ul className="space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.bookId} className="flex justify-between gap-3">
                <span className="line-clamp-2">
                  {l.quantity} × {l.title}
                </span>
                <span className="shrink-0 font-semibold">{formatTRY(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
              <dd>{formatTRY(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
              <dd>{shipping === 0 ? t("cart.free") : formatTRY(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
              <dt>{t("cart.total")}</dt>
              <dd>{formatTRY(subtotal + shipping)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </SiteShell>
  );
}
