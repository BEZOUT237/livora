import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { SiteShell, EmptyState } from "@/components/livora/SiteShell";
import { useSession, useRoles } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";
import { formatCurrency, useCurrency, type Currency } from "@/lib/currency";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account | LIVORA" },
      { name: "description", content: "Sign in to track LIVORA orders, manage your profile and see your saved books." },
      { property: "og:title", content: "My Account | LIVORA" },
      { property: "og:description", content: "Track your orders and manage your LIVORA profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AuthForm() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const field = "w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-accent";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (mode === "up" && f["password"] !== f["password_confirmation"]) {
      toast.error(t("auth.passwordMismatch"));
      return;
    }
    if (mode === "up" && !f["phone"]?.trim()) return;
    setBusy(true);
    const res =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email: f["email"]!, password: f["password"]! })
        : await supabase.auth.signUp({
            email: f["email"]!,
            password: f["password"]!,
            options: { data: { full_name: f["full_name"], phone: f["phone"] } },
          });
    setBusy(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    if (mode === "up") {
      if (res.data.session) {
        window.sessionStorage.setItem("livora.welcome", "1");
        navigate({ to: "/" });
        return;
      }
      setNotice(t("auth.signupComplete"));
      setMode("in");
      return;
    }
    window.sessionStorage.setItem("livora.welcome", "1");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-3xl">{mode === "in" ? t("auth.signin") : t("auth.signup")}</h1>
      {notice && <p className="mt-4 border border-accent/40 bg-accent/10 p-3 text-sm">{notice}</p>}
      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "up" && <input name="full_name" required placeholder={t("auth.name")} className={field} maxLength={120} />}
        {mode === "up" && <input name="phone" type="tel" required placeholder={t("auth.phone")} className={field} maxLength={30} />}
        <input name="email" type="email" required placeholder={t("auth.email")} className={field} />
        <input name="password" type="password" required minLength={6} placeholder={t("auth.password")} className={field} />
        {mode === "up" && (
          <input
            name="password_confirmation"
            type="password"
            required
            minLength={6}
            placeholder={t("auth.confirmPassword")}
            className={field}
          />
        )}
        <button disabled={busy} className="w-full rounded-md bg-ink py-3 text-sm font-bold text-ink-foreground disabled:opacity-60">
          {mode === "in" ? t("auth.signin") : t("auth.signup")}
        </button>
      </form>
      <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 text-xs underline">
        {mode === "in" ? t("auth.signup") : t("auth.signin")}
      </button>
    </div>
  );
}

function AccountPage() {
  const { data: session, isLoading } = useSession();
  const { isStaff } = useRoles();
  const { t } = useI18n();

  const { data: orders } = useQuery({
    queryKey: ["my-orders", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,order_number,status,total,currency,created_at")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <SiteShell>
      <div className="container-livora">
        {isLoading ? (
          <p className="py-24 text-center text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : !session ? (
          <AuthForm />
        ) : (
          <div className="py-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl">{t("nav.account")}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <div className="flex gap-2">
                {isStaff && (
                  <Link to="/admin" className="rounded-full border border-ink px-4 py-2 text-xs font-bold">
                    {t("nav.admin")}
                  </Link>
                )}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="rounded-full border border-border px-4 py-2 text-xs font-bold"
                >
                  {t("account.signout")}
                </button>
              </div>
            </div>

            <h2 className="mt-10 text-xl">{t("account.orders")}</h2>
            {(orders ?? []).length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No orders yet" description="Your future orders will appear here." />
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
                {(orders ?? []).map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                    <span className="font-semibold">#{o.order_number}</span>
                    <span className="text-muted-foreground">{formatDate(o.created_at)}</span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs">{o.status}</span>
                    <span className="font-bold">{formatCurrency(o.total, (o.currency || currency) as Currency)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
