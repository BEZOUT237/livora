import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User, Compass, Home, X } from "lucide-react";
import { useState } from "react";
import { useI18n, LOCALES, type Locale } from "@/lib/i18n";
import { useCurrency, type Currency } from "@/lib/currency";
import { useCart } from "@/lib/cart";
import { useRoles } from "@/lib/session";
import { cn } from "@/lib/utils";

function Wordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link to="/" className="flex flex-col leading-none">
      <span
        className={cn(
          "font-serif text-2xl font-semibold tracking-[0.14em]",
          tone === "light" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        LIVORA
      </span>
      <span className="text-[9px] font-semibold tracking-[0.32em] text-accent">INTERNATIONAL BOOKS</span>
    </Link>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-1 rounded-full border border-ink-foreground/20 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code as Locale)}
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-bold uppercase transition-colors",
            locale === l.code ? "bg-accent text-accent-foreground" : "text-ink-foreground/70 hover:text-ink-foreground",
          )}
        >
          {l.code}
        </button>
      ))}
    </div>
  );
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-1 rounded-full border border-ink-foreground/20 p-0.5">
      {(["TRY", "USD", "EUR"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setCurrency(code as Currency)}
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-bold uppercase transition-colors",
            currency === code ? "bg-accent text-accent-foreground" : "text-ink-foreground/70 hover:text-ink-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { t } = useI18n();
  const { count } = useCart();
  const { isStaff } = useRoles();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/books", search: { q: query || undefined } as never });
  };

  const links = [
    { to: "/books", label: t("nav.books") },
    { to: "/books", label: t("nav.english"), search: { lang: "EN" } },
    { to: "/books", label: t("nav.french"), search: { lang: "FR" } },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ink text-ink-foreground">
      <div className="border-b border-ink-foreground/10">
        <div className="container-livora flex items-center justify-center py-1.5 text-[11px] tracking-wide text-ink-foreground/70">
          {t("hero.eyebrow")} · {t("why.2.t")}
        </div>
      </div>

      <div className="container-livora flex h-16 items-center gap-4">
        <button
          type="button"
          className="lg:hidden"
          aria-label="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Menu className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Wordmark />

        <nav className="ml-6 hidden items-center gap-6 text-sm lg:flex">
          {links.map((l, i) => (
            <Link
              key={i}
              to={l.to as never}
              search={(l.search ?? {}) as never}
              className="text-ink-foreground/80 transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-2 md:flex">
          <Search className="size-4 text-ink-foreground/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${t("nav.search")}: title, author, ISBN`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-foreground/45"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 md:ml-4">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageSwitcher />
            <CurrencySwitcher />
          </div>
          {isStaff && (
            <Link to="/admin" className="hidden rounded-full border border-accent/50 px-3 py-1 text-xs font-bold text-accent lg:block">
              {t("nav.admin")}
            </Link>
          )}
          <Link to="/wishlist" aria-label={t("nav.wishlist")} className="hidden sm:block">
            <Heart className="size-5" />
          </Link>
          <Link to="/account" aria-label={t("nav.account")} className="hidden sm:block">
            <User className="size-5" />
          </Link>
          <Link to="/cart" aria-label={t("nav.cart")} className="relative">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-foreground/10 lg:hidden">
          <div className="container-livora space-y-3 py-4">
            <form onSubmit={submit} className="flex items-center gap-2 rounded-full border border-ink-foreground/20 px-3 py-2">
              <Search className="size-4 text-ink-foreground/60" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("nav.search")}
                className="w-full bg-transparent text-sm outline-none placeholder:text-ink-foreground/45"
              />
              <button type="button" onClick={() => setQuery("")}>
                <X className="size-4 text-ink-foreground/50" />
              </button>
            </form>
            <nav className="grid gap-1 text-sm">
              {links.map((l, i) => (
                <Link
                  key={i}
                  to={l.to as never}
                  search={(l.search ?? {}) as never}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 hover:bg-ink-foreground/10"
                >
                  {l.label}
                </Link>
              ))}
              {isStaff && (
                <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-accent">
                  {t("nav.admin")}
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <CurrencySwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function MobileTabBar() {
  const { t } = useI18n();
  const { count } = useCart();
  const items = [
    { to: "/", icon: Home, label: t("nav.home") },
    { to: "/books", icon: Compass, label: t("nav.explore") },
    { to: "/wishlist", icon: Heart, label: t("nav.wishlist") },
    { to: "/account", icon: User, label: t("nav.account") },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to as never}
            className="flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            <it.icon className="size-5" />
            {it.label}
          </Link>
        ))}
        <Link to="/cart" className="relative flex flex-col items-center gap-1 py-2 text-[10px] text-muted-foreground">
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute right-5 top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {count}
            </span>
          )}
          {t("nav.cart")}
        </Link>
      </div>
    </nav>
  );
}
