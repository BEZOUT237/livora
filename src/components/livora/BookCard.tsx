import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { formatTRY } from "@/lib/format";
import type { BookRow } from "@/lib/catalog";
import { getPublicAssetUrl } from "@/lib/utils";
import { StockBadge } from "./StockBadge";
import { cn } from "@/lib/utils";

function CoverArt({ book }: { book: BookRow }) {
  if (book.cover_url) {
    const imageUrl = getPublicAssetUrl(book.cover_url);
    return (
      <img
        src={imageUrl || book.cover_url}
        alt={`${book.title} cover`}
        loading="lazy"
        className="size-full object-cover"
      />
    );
  }
  return (
    <div className="flex size-full flex-col justify-between bg-ink p-4 text-ink-foreground">
      <span className="text-[10px] font-bold tracking-[0.2em] text-accent">{book.book_language}</span>
      <span className="font-serif text-base leading-tight line-clamp-4">{book.title}</span>
      <span className="text-[11px] text-ink-foreground/60">{book.authors?.name}</span>
    </div>
  );
}

export function BookCard({ book, className }: { book: BookRow; className?: string }) {
  return (
    <Link
      to="/books/$slug"
      params={{ slug: book.slug }}
      className={cn("group flex flex-col gap-3", className)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-secondary shadow-book transition-transform duration-300 group-hover:-translate-y-1">
        <CoverArt book={book} />
        {book.is_trending && (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent-foreground">
            TRENDING
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-bold tracking-wide">
          {book.book_language}
        </span>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-serif text-[15px] leading-snug line-clamp-2">{book.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{book.authors?.name ?? "—"}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold">{formatTRY(book.price)}</span>
          {book.compare_at_price && Number(book.compare_at_price) > Number(book.price) && (
            <span className="text-xs text-muted-foreground line-through">{formatTRY(book.compare_at_price)}</span>
          )}
        </div>
        <StockBadge state={book.stock_state} />
      </div>
    </Link>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[2/3] animate-pulse rounded-md bg-secondary" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-secondary" />
      <div className="h-3 w-2/5 animate-pulse rounded bg-secondary" />
    </div>
  );
}

export function WishlistButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="wishlist"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md border transition-colors",
        active ? "border-burgundy bg-burgundy/10 text-burgundy" : "border-border hover:bg-secondary",
      )}
    >
      <Heart className={cn("size-4", active && "fill-current")} />
    </button>
  );
}
