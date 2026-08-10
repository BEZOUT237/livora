import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/livora/SiteShell";
import { Partners } from "@/components/livora/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LIVORA — The Smart International Bookstore for Türkiye" },
      { name: "description", content: "LIVORA is an independent bookstore in Bolu specialised in English and French best-sellers, founded by YEMELINK and Algo Finance." },
      { property: "og:title", content: "About LIVORA" },
      { property: "og:description", content: "An independent, curated English & French bookstore based in Bolu, Türkiye." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <div className="container-livora max-w-3xl py-16">
        <p className="eyebrow">About</p>
        <h1 className="mt-3 text-4xl">The smart international bookstore for Türkiye.</h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          LIVORA is an independent bookstore based in Bolu, specialised in new English and French titles. We do not try
          to be the biggest catalogue in Türkiye — we try to be the best-curated one: the books people are actually
          talking about, in stock, priced fairly, and delivered quickly.
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The company is founded by Stéphane Yemeli (product, technology, brand and growth — founder of YEMELINK) and
          Nickel Feumo (finance, pricing, supply and inventory — founder of Algo Finance). Demand data drives our
          inventory, inventory drives procurement, procurement drives landed cost, and landed cost drives pricing. That
          loop is the heart of LIVORA.
        </p>
        <Link to="/books" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-ink-foreground">
          Explore the catalogue
        </Link>
      </div>
      <Partners />
    </SiteShell>
  );
}
