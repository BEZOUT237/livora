import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Minus, Plus, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/livora/SiteShell";
import { StockBadge } from "@/components/livora/StockBadge";
import { BookCard, WishlistButton } from "@/components/livora/BookCard";
import { fetchBookBySlug, fetchBooks, PUBLIC_DEFAULTS } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { useCurrency } from "@/lib/currency";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useSession } from "@/lib/session";
import { getPublicAssetUrl } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/books/$slug")({
  loader: async ({ params }) => {
    const book = await fetchBookBySlug(params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Book not found | LIVORA" }, { name: "robots", content: "noindex" }] };
    }
    const b = loaderData.book;
    const desc = (b.description ?? `${b.title} by ${b.authors?.name ?? "unknown author"}.`).slice(0, 155);
    return {
      meta: [
        { title: `${b.title} — ${b.authors?.name ?? "LIVORA"} | LIVORA` },
        { name: "description", content: desc },
        { property: "og:title", content: `${b.title} | LIVORA` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  errorComponent: () => (
    <SiteShell>
      <div className="container-livora py-24 text-center">
        <h1 className="text-2xl">This book couldn't be loaded</h1>
        <Link to="/books" className="mt-4 inline-block text-sm underline">
          Back to catalogue
        </Link>
      </div>
    </SiteShell>
  ),
  notFoundComponent: () => (
    <SiteShell>
      <div className="container-livora py-24 text-center">
        <h1 className="text-2xl">Book not found</h1>
        <Link to="/books" className="mt-4 inline-block text-sm underline">
          Back to catalogue
        </Link>
      </div>
    </SiteShell>
  ),
  component: BookPage,
});

function BookPage() {
  const { book } = Route.useLoaderData();
  const { t } = useI18n();
  const cart = useCart();
  const { data: session } = useSession();
  const { format } = useCurrency();
  const [qty, setQty] = useState(1);

  const available = Math.max(0, book.stock_qty - book.reserved_qty);
  const sellable = book.stock_state !== "out_of_stock";

  const { data: related } = useQuery({
    queryKey: ["related", book.id],
    queryFn: () => fetchBooks({ language: book.book_language, limit: 8 }),
  });

  const { data: wish, refetch: refetchWish } = useQuery({
    queryKey: ["wish", book.id, session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("book_id", book.id)
        .eq("user_id", session!.user.id)
        .maybeSingle();
      return data;
    },
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", book.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id,rating,title,comment,created_at")
        .eq("book_id", book.id)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const addToCart = () => {
    cart.add(
      {
        bookId: book.id,
        slug: book.slug,
        title: book.title,
        coverUrl: book.cover_url,
        price: Number(book.price),
        language: book.book_language,
        maxQty: available > 0 ? available : 5,
      },
      qty,
    );
    toast.success(`${book.title} — ${t("book.addToCart")}`);
  };

  const toggleWish = async () => {
    if (!session) {
      toast.info("Sign in to save books to your wishlist.");
      return;
    }
    if (wish) {
      await supabase.from("wishlist_items").delete().eq("id", wish.id);
    } else {
      await supabase.from("wishlist_items").insert({ book_id: book.id, user_id: session.user.id });
    }
    refetchWish();
  };

  const details: [string, string][] = [
    [t("book.language"), book.book_language],
    ["ISBN", book.isbn],
    [t("book.publisher"), book.publishers?.name ?? "—"],
    [t("book.format"), book.format],
    [t("book.pages"), String(book.pages ?? "—")],
    [t("book.published"), formatDate(book.published_date)],
  ];

  return (
    <SiteShell>
      <div className="container-livora py-8 lg:py-14">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">
            LIVORA
          </Link>{" "}
          / <Link to="/books" className="hover:underline">{t("catalog.title")}</Link> / <span>{book.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <div>
            <div className="aspect-[2/3] overflow-hidden rounded-lg bg-ink shadow-book">
              {book.cover_url ? (
                <img src={getPublicAssetUrl(book.cover_url) || book.cover_url} alt={`${book.title} cover`} className="size-full object-cover" />
              ) : (
                <div className="flex size-full flex-col justify-between p-8 text-ink-foreground">
                  <span className="text-xs font-bold tracking-[0.25em] text-accent">{book.book_language}</span>
                  <span className="font-serif text-3xl leading-tight">{book.title}</span>
                  <span className="text-sm text-ink-foreground/60">{book.authors?.name}</span>
                </div>
              )}
            </div>
            {book.is_demo && (
              <p className="mt-3 rounded-md bg-warning/10 px-3 py-2 text-[11px] font-semibold text-warning">
                DEMO product — placeholder catalogue data.
              </p>
            )}
          </div>

          <div>
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{book.title}</h1>
            {book.subtitle && <p className="mt-2 text-base text-muted-foreground">{book.subtitle}</p>}
            <p className="mt-3 text-sm">
              {book.authors?.name} · <span className="text-muted-foreground">{book.categories?.name_en}</span>
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={i < Math.round(Number(book.rating)) ? "size-4 fill-current" : "size-4"} />
                ))}
              </span>
              <span className="text-muted-foreground">
                {Number(book.rating).toFixed(1)} · {book.review_count}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-serif text-3xl">{format(book.price)}</span>
              {book.compare_at_price && Number(book.compare_at_price) > Number(book.price) && (
                <span className="text-base text-muted-foreground line-through">{format(book.compare_at_price)}</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <StockBadge state={book.stock_state} />
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="size-4" /> {t("book.delivery")}: {PUBLIC_DEFAULTS.deliveryEstimate} days
              </span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button className="px-3 py-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="minus">
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button className="px-3 py-2.5" onClick={() => setQty((q) => q + 1)} aria-label="plus">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                disabled={!sellable}
                onClick={addToCart}
                className="rounded-md bg-ink px-6 py-3 text-sm font-bold text-ink-foreground disabled:opacity-40"
              >
                {t("book.addToCart")}
              </button>
              <Link
                to="/cart"
                onClick={addToCart}
                className="rounded-md border border-ink px-6 py-3 text-sm font-bold hover:bg-secondary"
              >
                {t("book.buyNow")}
              </Link>
              <WishlistButton active={!!wish} onClick={toggleWish} />
            </div>

            {book.why_you_like_it && (
              <div className="mt-8 rounded-lg border border-accent/30 bg-accent/8 p-5">
                <p className="eyebrow text-accent-foreground">{t("book.why")}</p>
                <p className="mt-2 text-sm">{book.why_you_like_it}</p>
              </div>
            )}

            {book.description && <p className="mt-8 max-w-2xl text-sm leading-relaxed">{book.description}</p>}

            <div className="mt-8">
              <p className="eyebrow">{t("book.details")}</p>
              <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-border py-2 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10">
              <p className="eyebrow">{t("book.reviews")}</p>
              {(reviews ?? []).length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No published reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {(reviews ?? []).map((r) => (
                    <li key={r.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2 text-warning">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-2 text-sm font-semibold">{r.title}</p>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ul className="mt-10 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
              {["New books only", "Secure payment", "Support in TR/EN/FR"].map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <Check className="size-4 text-success" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl">{t("book.related")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">
            {(related ?? [])
              .filter((r) => r.id !== book.id)
              .slice(0, 6)
              .map((r) => (
                <BookCard key={r.id} book={r} />
              ))}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
