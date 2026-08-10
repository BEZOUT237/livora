import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteShell, EmptyState } from "@/components/livora/SiteShell";
import { BookCard } from "@/components/livora/BookCard";
import { useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { BOOK_SELECT, type BookRow } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist | LIVORA" },
      { name: "description", content: "Books you saved on LIVORA — get notified when they are back in stock or drop in price." },
      { property: "og:title", content: "My Wishlist | LIVORA" },
      { property: "og:description", content: "Books you saved on LIVORA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { data: session } = useSession();
  const { t } = useI18n();

  const { data } = useQuery({
    queryKey: ["wishlist", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data } = await supabase.from("wishlist_items").select(`books(${BOOK_SELECT})`);
      return ((data ?? []) as unknown as { books: BookRow }[]).map((r) => r.books).filter(Boolean);
    },
  });

  return (
    <SiteShell>
      <div className="container-livora py-12">
        <h1 className="text-3xl">{t("nav.wishlist")}</h1>
        {!session ? (
          <div className="mt-8">
            <EmptyState
              title="Sign in to see your wishlist"
              action={
                <Link to="/account" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
                  {t("auth.signin")}
                </Link>
              }
            />
          </div>
        ) : (data ?? []).length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No saved books yet"
              action={
                <Link to="/books" className="rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
                  {t("hero.cta")}
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-6">
            {(data ?? []).map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
