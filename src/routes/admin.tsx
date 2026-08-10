import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Boxes, PackageSearch, TrendingUp } from "lucide-react";
import { useRoles, useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";
import { formatTRY, landedCost, marginPct } from "@/lib/format";
import { BOOK_SELECT } from "@/lib/catalog";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Operations | LIVORA" },
      { name: "description", content: "LIVORA operations dashboard: catalogue, inventory, orders, pricing and margins." },
      { property: "og:title", content: "LIVORA Admin" },
      { property: "og:description", content: "Internal operations dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type AdminBook = {
  id: string;
  title: string;
  slug: string;
  isbn: string;
  price: number;
  stock_qty: number;
  reorder_threshold: number;
  purchase_cost: number;
  purchase_fx_rate: number;
  purchase_currency: string;
  shipping_cost: number;
  customs_cost: number;
  packaging_cost: number;
  units_sold: number;
  book_language: string;
  stock_state: string;
};

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Boxes }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-3 font-serif text-2xl">{value}</p>
    </div>
  );
}

function AdminPage() {
  const { data: session, isLoading } = useSession();
  const { isStaff, loading } = useRoles();

  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    enabled: isStaff,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select(
          "id,title,slug,isbn,price,stock_qty,reorder_threshold,purchase_cost,purchase_fx_rate,purchase_currency,shipping_cost,customs_cost,packaging_cost,units_sold,book_language,stock_state",
        )
        .order("units_sold", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as AdminBook[];
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isStaff,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,order_number,status,total,created_at,full_name")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  if (isLoading || loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!session || !isStaff) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl">Staff access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account does not have an operations role yet.
          </p>
          <Link to="/account" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const list = books ?? [];
  const inventoryValue = list.reduce((s, b) => s + landedCost(b) * b.stock_qty, 0);
  const lowStock = list.filter((b) => b.stock_qty <= b.reorder_threshold);
  const revenue = (orders ?? []).reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-ink text-ink-foreground">
        <div className="container-livora flex h-16 items-center justify-between">
          <div>
            <span className="font-serif text-xl tracking-[0.14em]">LIVORA</span>
            <span className="ml-3 text-[10px] font-bold tracking-[0.25em] text-accent">OPERATIONS</span>
          </div>
          <Link to="/" className="text-xs underline">
            View storefront
          </Link>
        </div>
      </header>

      <main className="container-livora space-y-10 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Recent revenue" value={formatTRY(revenue)} icon={TrendingUp} />
          <Stat label="Inventory value" value={formatTRY(inventoryValue)} icon={Boxes} />
          <Stat label="SKUs" value={String(list.length)} icon={PackageSearch} />
          <Stat label="Low stock" value={String(lowStock.length)} icon={AlertTriangle} />
        </div>

        <section>
          <h2 className="text-xl">Catalogue &amp; margins</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Lang</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Landed cost</th>
                  <th className="p-3">Margin</th>
                  <th className="p-3">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((b) => {
                  const landed = landedCost(b);
                  const m = marginPct(Number(b.price), landed);
                  return (
                    <tr key={b.id}>
                      <td className="p-3">
                        <Link to="/books/$slug" params={{ slug: b.slug }} className="font-medium hover:underline">
                          {b.title}
                        </Link>
                        <div className="text-xs text-muted-foreground">{b.isbn}</div>
                      </td>
                      <td className="p-3">{b.book_language}</td>
                      <td className="p-3">
                        <span className={b.stock_qty <= b.reorder_threshold ? "font-bold text-warning" : ""}>
                          {b.stock_qty}
                        </span>
                      </td>
                      <td className="p-3">{formatTRY(b.price)}</td>
                      <td className="p-3 text-muted-foreground">{formatTRY(landed)}</td>
                      <td className={`p-3 font-semibold ${m < 20 ? "text-destructive" : "text-success"}`}>
                        {m.toFixed(1)}%
                      </td>
                      <td className="p-3">{b.units_sold}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl">Latest orders</h2>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(orders ?? []).length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-muted-foreground" colSpan={4}>
                      No orders yet.
                    </td>
                  </tr>
                )}
                {(orders ?? []).map((o) => (
                  <tr key={o.id}>
                    <td className="p-3 font-medium">#{o.order_number}</td>
                    <td className="p-3">{o.full_name}</td>
                    <td className="p-3">{o.status}</td>
                    <td className="p-3 font-semibold">{formatTRY(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export const BOOK_SELECT_REF = BOOK_SELECT;
