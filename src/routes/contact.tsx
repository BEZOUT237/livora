import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/livora/SiteShell";
import { fetchSiteContent, DEFAULT_SITE_CONTENT, getSiteValue } from "@/lib/catalog";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | LIVORA" },
      { name: "description", content: "Get in touch with LIVORA for orders, partnerships, and support." },
      { property: "og:title", content: "Contact LIVORA" },
      { property: "og:description", content: "Reach out to LIVORA by email or visit us in Bolu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: siteContent } = useQuery({ queryKey: ["site-content"], queryFn: fetchSiteContent });
  const contactEmail = getSiteValue(siteContent, "contact_email", DEFAULT_SITE_CONTENT.contact_email);
  const contactAddress = getSiteValue(siteContent, "contact_address", DEFAULT_SITE_CONTENT.contact_address);
  const contactPhone = getSiteValue(siteContent, "contact_phone", DEFAULT_SITE_CONTENT.contact_phone);

  return (
    <SiteShell>
      <div className="container-livora py-16 md:py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-panel">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl">Say hello to LIVORA.</h1>
          <p className="mt-4 text-base text-muted-foreground">
            We are here for orders, editorial questions, business partnerships, and support.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-secondary/40 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Email</p>
              <a href={`mailto:${contactEmail}`} className="mt-3 inline-block text-lg font-semibold hover:text-accent">
                {contactEmail}
              </a>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Phone</p>
              <p className="mt-3 text-lg font-semibold">{contactPhone}</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/40 p-5 md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Address</p>
              <p className="mt-3 text-lg font-semibold">{contactAddress}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${contactEmail}`} className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-ink-foreground">
              Email us
            </a>
            <Link to="/books" className="rounded-full border border-border px-6 py-3 text-sm font-bold">
              Browse books
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
