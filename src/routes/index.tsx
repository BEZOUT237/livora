import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteShell } from "@/components/livora/SiteShell";
import { BookRail } from "@/components/livora/BookRail";
import { Partners } from "@/components/livora/Footer";
import { DEFAULT_SITE_CONTENT, fetchCollectionBooks, fetchHomepageSections, fetchSiteContent, getSiteValue, type BookRow } from "@/lib/catalog";
import { localized, useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-books.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIVORA — International Books for Türkiye" },
      {
        name: "description",
        content:
          "Curated English and French best-sellers, delivered across Türkiye from Bolu. New books only, fast delivery, honest pricing.",
      },
      { property: "og:title", content: "LIVORA — International Books" },
      {
        property: "og:description",
        content: "The smart international bookstore for Türkiye. English & French best-sellers, curated and shipped fast.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function Hero() {
  const { t } = useI18n();
  const { data: siteContent } = useQuery({ queryKey: ["site-content"], queryFn: fetchSiteContent });
  const heroEyebrow = getSiteValue(siteContent, "home_hero_eyebrow", "From Bolu to all of Türkiye");
  const heroTitle = getSiteValue(siteContent, "home_hero_title", "English and French books, intelligently curated.");
  const heroSubtitle = getSiteValue(siteContent, "home_hero_subtitle", "The world's most talked-about titles, with fast delivery and honest pricing.");

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <img
        src={heroImage}
        alt="Stack of hardcover books"
        width={1600}
        height={1104}
        className="absolute inset-0 size-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
      <div className="container-livora relative grid gap-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent">{heroEyebrow || t("hero.eyebrow")}</p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{heroTitle || t("hero.title")}</h1>
          <p className="mt-5 max-w-lg text-base text-ink-foreground/75">{heroSubtitle || t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("hero.cta")} <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/books"
              search={{ sort: "bestsellers" } as never}
              className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/30 px-6 py-3 text-sm font-bold hover:border-accent hover:text-accent"
            >
              {t("hero.cta2")}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs text-ink-foreground/60">
            <span>EN · FR titles</span>
            <span>New books only</span>
            <span>Delivery across Türkiye</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionRail({ section }: { section: Record<string, unknown> }) {
  const { locale } = useI18n();
  const collectionId = section["collection_id"] as string | null;
  const { data, isLoading } = useQuery({
    queryKey: ["collection", collectionId],
    enabled: !!collectionId,
    queryFn: () => fetchCollectionBooks(collectionId!),
  });
  if (!collectionId) return null;
  return (
    <BookRail
      title={localized(section, "title", locale)}
      books={(data ?? []) as BookRow[]}
      loading={isLoading}
      href="/books"
    />
  );
}

function Why() {
  const { t } = useI18n();
  const items = [
    { icon: Sparkles, t: t("why.1.t"), d: t("why.1.d") },
    { icon: BookOpen, t: t("why.2.t"), d: t("why.2.d") },
    { icon: Truck, t: t("why.3.t"), d: t("why.3.d") },
    { icon: ShieldCheck, t: t("why.4.t"), d: t("why.4.d") },
  ];
  return (
    <section className="py-14">
      <div className="container-livora">
        <h2 className="text-2xl sm:text-3xl">{t("why.title")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.t} className="rounded-lg border border-border bg-card p-6 shadow-panel">
              <it.icon className="size-5 text-accent" />
              <h3 className="mt-4 font-serif text-lg">{it.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase(), locale });
    setBusy(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setEmail("");
    toast.success(t("news.ok"));
  };

  return (
    <section className="py-16">
      <div className="container-livora">
        <div className="rounded-2xl bg-ink px-6 py-12 text-ink-foreground sm:px-12">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-serif text-3xl">{t("news.title")}</h2>
              <p className="mt-2 text-sm text-ink-foreground/70">{t("news.sub")}</p>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("news.email")}
                className="w-full rounded-full border border-ink-foreground/25 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-ink-foreground/40 focus:border-accent"
              />
              <button
                type="submit"
                disabled={busy}
                className="shrink-0 rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground disabled:opacity-60"
              >
                {t("news.cta")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  const { t } = useI18n();
  const [welcome, setWelcome] = useState(false);
  const { data: sections, isLoading } = useQuery({ queryKey: ["homepage-sections"], queryFn: fetchHomepageSections });

  useEffect(() => {
    if (window.sessionStorage.getItem("livora.welcome") === "1") {
      window.sessionStorage.removeItem("livora.welcome");
      setWelcome(true);
    }
  }, []);

  return (
    <SiteShell>
      {welcome && <div className="container-livora pt-6"><p className="border border-accent/40 bg-accent/10 p-4 text-center text-sm font-semibold">{t("auth.welcome")}</p></div>}
      <Hero />
      {isLoading && <div className="container-livora py-12 text-sm text-muted-foreground">Loading…</div>}
      {(sections ?? []).map((s) => (
        <SectionRail key={s.id} section={s as unknown as Record<string, unknown>} />
      ))}
      <Why />
      <Partners />
      <Newsletter />
    </SiteShell>
  );
}
