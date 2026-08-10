import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { SiteShell, EmptyState } from "@/components/livora/SiteShell";
import { BookCard, BookCardSkeleton } from "@/components/livora/BookCard";
import { fetchBooks } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { localized, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  lang: z.string().optional(),
  cat: z.string().optional(),
  sort: z.string().optional(),
  max: z.number().optional(),
  inStock: z.boolean().optional(),
});

export const Route = createFileRoute("/books/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Books — English & French Titles | LIVORA" },
      { name: "description", content: "Browse LIVORA's curated catalogue of English and French books. Filter by language, category, price and availability." },
      { property: "og:title", content: "All Books | LIVORA" },
      { property: "og:description", content: "Curated English and French books, filterable by language, category and price." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

const SORTS = ["recommended", "bestsellers", "price_asc", "price_desc", "newest"];

function CatalogPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t, locale } = useI18n();
  const [term, setTerm] = useState(search.q ?? "");
  const [showFilters, setShowFilters] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("slug,name_tr,name_en,name_fr").order("sort_order");
      return data ?? [];
    },
  });

  const { data: books, isLoading } = useQuery({
    queryKey: ["books", search],
    queryFn: () =>
      fetchBooks({
        search: search.q,
        language: search.lang,
        category: search.cat,
        sort: search.sort,
        maxPrice: search.max,
        inStockOnly: search.inStock,
      }),
  });

  const update = (patch: Record<string, unknown>) =>
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }) as never });

  const filters = (
    <div className="space-y-6 text-sm">
      <div>
        <p className="eyebrow">{t("book.language")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { v: undefined, l: "All" },
            { v: "EN", l: "English" },
            { v: "FR", l: "Français" },
          ].map((o) => (
            <button
              key={o.l}
              onClick={() => update({ lang: o.v })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                search.lang === o.v ? "border-ink bg-ink text-ink-foreground" : "border-border hover:bg-secondary",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Category</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(categories ?? []).map((c) => (
            <button
              key={c.slug}
              onClick={() => update({ cat: search.cat === c.slug ? undefined : c.slug })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                search.cat === c.slug ? "border-ink bg-ink text-ink-foreground" : "border-border hover:bg-secondary",
              )}
            >
              {localized(c as unknown as Record<string, unknown>, "name", locale)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Max price</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[350, 500, 750, 1000].map((p) => (
            <button
              key={p}
              onClick={() => update({ max: search.max === p ? undefined : p })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold",
                search.max === p ? "border-ink bg-ink text-ink-foreground" : "border-border hover:bg-secondary",
              )}
            >
              ≤ {p} TL
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-semibold">
        <input
          type="checkbox"
          checked={!!search.inStock}
          onChange={(e) => update({ inStock: e.target.checked || undefined })}
          className="size-4 accent-[oklch(0.19_0.038_264)]"
        />
        In stock only
      </label>

      <button onClick={() => navigate({ search: {} as never })} className="text-xs font-semibold underline">
        {t("catalog.clear")}
      </button>
    </div>
  );

  return (
    <SiteShell>
      <div className="container-livora py-10">
        <h1 className="text-3xl sm:text-4xl">{t("catalog.title")}</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: term || undefined });
          }}
          className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3"
        >
          <Search className="size-4 text-muted-foreground" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Title, author, ISBN, publisher…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold lg:hidden"
          >
            <SlidersHorizontal className="size-4" /> {t("catalog.filters")}
          </button>
          <select
            value={search.sort ?? "recommended"}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold"
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {t(`sort.${s}`)}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {books?.length ?? 0} {t("catalog.results")}
          </span>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className={cn("lg:block", showFilters ? "block" : "hidden")}>{filters}</aside>
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : (books ?? []).length === 0 ? (
              <EmptyState
                title={t("catalog.empty")}
                description="Try a different keyword, or clear your filters."
                action={
                  <Link to="/books" search={{} as never} className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
                    {t("catalog.clear")}
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {(books ?? []).map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
