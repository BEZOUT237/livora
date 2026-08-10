import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { BookRow } from "@/lib/catalog";
import { BookCard, BookCardSkeleton } from "./BookCard";
import { useI18n } from "@/lib/i18n";

export function BookRail({
  title,
  subtitle,
  books,
  loading,
  href,
}: {
  title: string;
  subtitle?: string;
  books: BookRow[];
  loading?: boolean;
  href?: string;
}) {
  const { t } = useI18n();
  if (!loading && books.length === 0) return null;

  return (
    <section className="py-10">
      <div className="container-livora">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {href && (
            <Link
              to={href as never}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold hover:text-accent sm:inline-flex"
            >
              {t("section.viewAll")} <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[44vw] shrink-0 snap-start sm:w-auto">
                  <BookCardSkeleton />
                </div>
              ))
            : books.slice(0, 12).map((b) => (
                <div key={b.id} className="w-[44vw] shrink-0 snap-start sm:w-auto">
                  <BookCard book={b} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
