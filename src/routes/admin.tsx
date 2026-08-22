import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Boxes,
  CreditCard,
  LayoutDashboard,
  LibraryBig,
  ListOrdered,
  Package,
  PackageSearch,
  Palette,
  ReceiptText,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  Users,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CrudSection } from "@/components/admin/CrudSection";
import { formatTRY, landedCost, marginPct } from "@/lib/format";
import { useRoles, useSession } from "@/lib/session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Control Center | LIVORA" },
      { name: "description", content: "LIVORA control center for books, orders, inventory, content and commerce operations." },
      { property: "og:title", content: "LIVORA Admin" },
      { property: "og:description", content: "Internal operations dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type ModuleKey =
  | "dashboard"
  | "books"
  | "orders"
  | "payments"
  | "customers"
  | "inventory"
  | "suppliers"
  | "content"
  | "homepage"
  | "categories"
  | "collections"
  | "media"
  | "marketing"
  | "promotions"
  | "shipping"
  | "reviews"
  | "analytics"
  | "settings"
  | "admins"
  | "activity";

const moduleMeta: Array<{ key: ModuleKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "books", label: "Books", icon: LibraryBig },
  { key: "orders", label: "Orders", icon: ListOrdered },
  { key: "payments", label: "Payments / Dekont", icon: CreditCard },
  { key: "customers", label: "Customers", icon: Users },
  { key: "inventory", label: "Inventory", icon: Package },
  { key: "suppliers", label: "Suppliers", icon: Truck },
  { key: "content", label: "Content CMS", icon: ReceiptText },
  { key: "homepage", label: "Homepage", icon: Palette },
  { key: "categories", label: "Categories", icon: Sparkles },
  { key: "collections", label: "Collections", icon: Wand2 },
  { key: "media", label: "Media Library", icon: PackageSearch },
  { key: "marketing", label: "Marketing", icon: Activity },
  { key: "promotions", label: "Promotions", icon: ShoppingCart },
  { key: "shipping", label: "Shipping", icon: Truck },
  { key: "reviews", label: "Reviews", icon: ShieldCheck },
  { key: "analytics", label: "Analytics", icon: Activity },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "admins", label: "Admin Users", icon: Users },
  { key: "activity", label: "Activity Log", icon: Activity },
];

const BOOK_FIELDS = [
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "isbn", label: "ISBN", type: "text" as const },
  { name: "book_language", label: "Language", type: "select" as const, options: [{ value: "EN", label: "EN" }, { value: "FR", label: "FR" }, { value: "TR", label: "TR" }] },
  { name: "price", label: "Price", type: "number" as const, default: 0 },
  { name: "stock_qty", label: "Stock", type: "number" as const, default: 0 },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "cover_url", label: "Cover URL", type: "image" as const },
  { name: "description", label: "Description", type: "textarea" as const },
];

const CATEGORY_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "name_tr", label: "Name (TR)", type: "text" as const, required: true },
  { name: "name_en", label: "Name (EN)", type: "text" as const, required: true },
  { name: "name_fr", label: "Name (FR)", type: "text" as const, required: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const COLLECTION_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "title_tr", label: "Title (TR)", type: "text" as const, required: true },
  { name: "title_en", label: "Title (EN)", type: "text" as const, required: true },
  { name: "title_fr", label: "Title (FR)", type: "text" as const, required: true },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const SUPPLIER_FIELDS = [
  { name: "name", label: "Supplier", type: "text" as const, required: true },
  { name: "contact_name", label: "Contact", type: "text" as const },
  { name: "email", label: "Email", type: "text" as const },
  { name: "phone", label: "Phone", type: "text" as const },
  { name: "currency", label: "Currency", type: "select" as const, options: [{ value: "TRY", label: "TRY" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }] },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
];

const SETTINGS_FIELDS = [
  { name: "category", label: "Category", type: "text" as const, required: true },
  { name: "key", label: "Key", type: "text" as const, required: true },
  { name: "label", label: "Label", type: "text" as const, required: true },
  { name: "value", label: "Value", type: "text" as const, required: true },
];

const HOMEPAGE_FIELDS = [
  { name: "key", label: "Key", type: "text" as const, required: true },
  { name: "title_tr", label: "Title (TR)", type: "text" as const },
  { name: "title_en", label: "Title (EN)", type: "text" as const },
  { name: "title_fr", label: "Title (FR)", type: "text" as const },
  { name: "is_enabled", label: "Enabled", type: "boolean" as const, default: true },
  { name: "sort_order", label: "Sort order", type: "number" as const, default: 0 },
];

const PROMOTION_FIELDS = [
  { name: "code", label: "Code", type: "text" as const, required: true },
  { name: "description", label: "Description", type: "textarea" as const },
  { name: "discount_type", label: "Type", type: "select" as const, options: [{ value: "percent", label: "Percent" }, { value: "fixed", label: "Fixed" }] },
  { name: "discount_value", label: "Value", type: "number" as const, default: 0 },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
  { name: "min_cart_total", label: "Minimum cart", type: "number" as const, default: 0 },
];

const REVIEW_FIELDS = [
  { name: "book_id", label: "Book ID", type: "text" as const, required: true },
  { name: "rating", label: "Rating", type: "number" as const, default: 5 },
  { name: "title", label: "Title", type: "text" as const },
  { name: "comment", label: "Comment", type: "textarea" as const },
  { name: "is_approved", label: "Approved", type: "boolean" as const, default: true },
];

const ORDER_FIELDS = [
  { name: "order_number", label: "Order", type: "text" as const, inTable: true },
  { name: "full_name", label: "Customer", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const, required: true },
  { name: "status", label: "Status", type: "select" as const, options: [{ value: "pending_payment", label: "Pending payment" }, { value: "paid", label: "Paid" }, { value: "shipped", label: "Shipped" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }] },
  { name: "payment_status", label: "Payment", type: "select" as const, options: [{ value: "pending", label: "Pending" }, { value: "pending_verification", label: "Verification" }, { value: "paid", label: "Paid" }] },
  { name: "total", label: "Total", type: "number" as const, default: 0 },
  { name: "shipping_carrier", label: "Carrier", type: "text" as const },
  { name: "tracking_number", label: "Tracking", type: "text" as const },
];

const INVENTORY_FIELDS = [
  { name: "book_id", label: "Book ID", type: "text" as const, required: true },
  { name: "delta", label: "Quantity change", type: "number" as const, required: true },
  { name: "reason", label: "Reason", type: "text" as const, required: true },
  { name: "reference", label: "Reference", type: "text" as const },
];

const BLOG_FIELDS = [
  { name: "slug", label: "Slug", type: "text" as const, required: true },
  { name: "title", label: "Title", type: "text" as const, required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea" as const },
  { name: "body", label: "Body", type: "textarea" as const },
  { name: "cover_url", label: "Cover", type: "image" as const },
  { name: "is_published", label: "Published", type: "boolean" as const, default: false },
];

const AMBASSADOR_FIELDS = [
  { name: "name", label: "Name", type: "text" as const, required: true },
  { name: "email", label: "Email", type: "text" as const },
  { name: "code", label: "Code", type: "text" as const, required: true },
  { name: "commission_pct", label: "Commission %", type: "number" as const, default: 5 },
  { name: "is_active", label: "Active", type: "boolean" as const, default: true },
];

const PURCHASE_ORDER_FIELDS = [
  { name: "po_number", label: "PO number", type: "text" as const },
  { name: "supplier_id", label: "Supplier ID", type: "text" as const },
  { name: "status", label: "Status", type: "text" as const, default: "draft" },
  { name: "currency", label: "Currency", type: "select" as const, options: [{ value: "TRY", label: "TRY" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }] },
  { name: "expected_at", label: "Expected", type: "date" as const },
  { name: "total_cost", label: "Total cost", type: "number" as const, default: 0 },
  { name: "notes", label: "Notes", type: "textarea" as const },
];

const CUSTOMER_FIELDS = [
  { name: "full_name", label: "Name", type: "text" as const },
  { name: "phone", label: "Phone", type: "text" as const },
  { name: "locale", label: "Locale", type: "select" as const, options: [{ value: "tr", label: "TR" }, { value: "en", label: "EN" }, { value: "fr", label: "FR" }] },
  { name: "newsletter_opt_in", label: "Newsletter", type: "boolean" as const, default: false },
];

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Boxes }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-3 font-serif text-2xl">{value}</p>
    </div>
  );
}

function ModuleSummaryCard({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {badge}
        </span>
      </div>
    </div>
  );
}

function DashboardPanel() {
  const { data: books } = useQuery({
    queryKey: ["admin-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id,title,slug,isbn,price,stock_qty,reorder_threshold,purchase_cost,purchase_fx_rate,purchase_currency,shipping_cost,customs_cost,packaging_cost,units_sold,book_language,stock_state")
        .order("units_sold", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Array<Record<string, unknown>>;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,status,total,created_at,full_name")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
  });

  const list = books ?? [];
  const inventoryValue = list.reduce((sum, book) => {
    const purchaseCost = Number(book.purchase_cost ?? 0);
    const fxRate = Number(book.purchase_fx_rate ?? 1);
    const shippingCost = Number(book.shipping_cost ?? 0);
    const customsCost = Number(book.customs_cost ?? 0);
    const packagingCost = Number(book.packaging_cost ?? 0);
    return sum + (purchaseCost * fxRate + shippingCost + customsCost + packagingCost) * Number(book.stock_qty ?? 0);
  }, 0);
  const lowStock = list.filter((book) => Number(book.stock_qty ?? 0) <= Number(book.reorder_threshold ?? 0));
  const revenue = (orders ?? []).reduce((sum, order) => sum + Number(order.total ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Revenue" value={formatTRY(revenue)} icon={TrendingUpIcon} />
        <Stat label="Inventory value" value={formatTRY(inventoryValue)} icon={Boxes} />
        <Stat label="SKUs" value={String(list.length)} icon={PackageSearch} />
        <Stat label="Low stock" value={String(lowStock.length)} icon={AlertTriangle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">Catalogue margin snapshot</h2>
            <Link to="/books" className="text-sm text-accent hover:underline">Open catalogue</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Landed</th>
                  <th className="p-2">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(list.slice(0, 6) as Array<Record<string, unknown>>).map((book) => {
                  const landed = landedCost(book as never);
                  const m = marginPct(Number(book.price ?? 0), landed);
                  return (
                    <tr key={String(book.id)}>
                      <td className="p-2">{String(book.title ?? "—")}</td>
                      <td className="p-2">{formatTRY(book.price ?? 0)}</td>
                      <td className="p-2 text-muted-foreground">{formatTRY(landed)}</td>
                      <td className={`p-2 font-semibold ${m < 20 ? "text-destructive" : "text-success"}`}>{m.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
          <h2 className="text-xl">Operations snapshot</h2>
          <div className="mt-4 space-y-3">
            <ModuleSummaryCard title="Payments" subtitle="Awaiting dekont review" badge="3" />
            <ModuleSummaryCard title="Returns" subtitle="2 shipping tickets open" badge="2" />
            <ModuleSummaryCard title="Marketing" subtitle="3 campaigns active" badge="3" />
            <ModuleSummaryCard title="Inventory" subtitle="7 SKUs below reorder threshold" badge="7" />
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentPanel() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-payment-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id,order_number,full_name,email,total,currency,payment_status,status,payment_proof_path")
        .in("payment_status", ["pending", "pending_verification"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const approve = async (id: string) => {
    const { error } = await supabase.from("orders").update({ payment_status: "paid", status: "paid" }).eq("id", id);
    if (!error) queryClient.invalidateQueries({ queryKey: ["admin-payment-orders"] });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-panel">
        <h2 className="text-xl">Payment approvals</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && <tr><td className="p-4" colSpan={5}>Loading…</td></tr>}
              {!isLoading && orders?.length === 0 && <tr><td className="p-4" colSpan={5}>No payment proofs awaiting review.</td></tr>}
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td className="p-3">#{order.order_number}</td>
                  <td className="p-3">{order.full_name}</td>
                  <td className="p-3">{formatTRY(order.total)}</td>
                  <td className="p-3"><span className="rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">{order.payment_status}</span></td>
                  <td className="p-3 flex gap-2">
                    {order.payment_proof_path && <a href={order.payment_proof_path} target="_blank" rel="noreferrer" className="rounded-md border border-border px-3 py-1.5 text-xs font-bold">Proof</a>}
                    <button onClick={() => approve(order.id)} className="rounded-md bg-ink px-3 py-1.5 text-xs font-bold text-ink-foreground">Approve</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericModule({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-panel">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ModuleSummaryCard title="Today" subtitle="Live status" badge="On" />
        <ModuleSummaryCard title="This week" subtitle="Updated items" badge="12" />
        <ModuleSummaryCard title="Needs review" subtitle="Action queue" badge="3" />
      </div>
    </div>
  );
}

function AdminPage() {
  const { data: session, isLoading } = useSession();
  const { isStaff, loading } = useRoles();
  const [active, setActive] = useState<ModuleKey>("dashboard");

  const activeLabel = useMemo(() => moduleMeta.find((m) => m.key === active)?.label ?? "Dashboard", [active]);

  if (isLoading || loading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!session || !isStaff) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl">Staff access only</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your account does not have an operations role yet.</p>
          <Link to="/account" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-ink-foreground">Sign in</Link>
        </div>
      </div>
    );
  }

  const moduleContent = (() => {
    switch (active) {
      case "dashboard":
        return <DashboardPanel />;
      case "books":
        return <CrudSection table="books" title="Books" description="Catalogue, pricing, stock and best-seller signals." fields={BOOK_FIELDS} select="id,title,slug,isbn,price,stock_qty,book_language,is_active,cover_url,description" orderBy={{ column: "created_at", ascending: false }} searchKeys={["title", "isbn", "slug"]} />;
      case "categories":
        return <CrudSection table="categories" title="Categories" description="Merchandising and browse filters." fields={CATEGORY_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["name_tr", "name_en", "name_fr"]} />;
      case "collections":
        return <CrudSection table="collections" title="Collections" description="Curated landing pages and editorial bundles." fields={COLLECTION_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["title_tr", "title_en", "title_fr"]} />;
      case "suppliers":
        return <CrudSection table="suppliers" title="Suppliers" description="Procurement partners and lead times." fields={SUPPLIER_FIELDS} select="*" orderBy={{ column: "name", ascending: true }} searchKeys={["name", "contact_name", "email"]} />;
      case "homepage":
        return <CrudSection table="homepage_sections" title="Homepage" description="homepage_sections used for homepage rails and collection blocks." fields={HOMEPAGE_FIELDS} select="*" orderBy={{ column: "sort_order", ascending: true }} searchKeys={["key", "title_tr", "title_en", "title_fr"]} />;
      case "promotions":
        return <CrudSection table="promotions" title="Promotions" description="Coupons and seasonal campaigns." fields={PROMOTION_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["code", "description"]} />;
      case "reviews":
        return <CrudSection table="reviews" title="Reviews" description="Customer sentiment and moderation queue." fields={REVIEW_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["title", "comment", "book_id"]} />;
      case "settings":
        return <CrudSection table="settings" title="Settings" description="Storefront configuration and operational flags." fields={SETTINGS_FIELDS} select="*" orderBy={{ column: "category", ascending: true }} searchKeys={["key", "label", "value"]} />;
      case "payments":
        return <PaymentPanel />;
      case "orders":
        return <CrudSection table="orders" title="Orders" description="Order lifecycle, fulfilment and shipping handoff." fields={ORDER_FIELDS} select="id,order_number,full_name,email,status,payment_status,total,shipping_carrier,tracking_number" orderBy={{ column: "created_at", ascending: false }} searchKeys={["order_number", "full_name", "email", "status"]} />;
      case "customers":
        return <CrudSection table="profiles" title="Customers" description="Profiles, retention and communication preferences." fields={CUSTOMER_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["full_name", "phone", "locale"]} />;
      case "inventory":
        return <CrudSection table="inventory_movements" title="Inventory" description="Stock movements and purchase planning history." fields={INVENTORY_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["book_id", "reason", "reference"]} />;
      case "content":
        return <CrudSection table="blog_posts" title="Content CMS" description="Long-form content, article library and editorial updates." fields={BLOG_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["slug", "title", "excerpt"]} />;
      case "media":
        return <CrudSection table="blog_posts" title="Media Library" description="Cover and editorial image assets currently attached to content." fields={BLOG_FIELDS.filter((field) => ["title", "cover_url"].includes(field.name))} select="id,title,cover_url,created_at" orderBy={{ column: "created_at", ascending: false }} searchKeys={["title", "cover_url"]} />;
      case "marketing":
        return <CrudSection table="ambassadors" title="Marketing" description="Referral partners and campaign attribution." fields={AMBASSADOR_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["name", "email", "code"]} />;
      case "shipping":
        return <CrudSection table="purchase_orders" title="Shipping" description="Inbound procurement and delivery planning." fields={PURCHASE_ORDER_FIELDS} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["po_number", "supplier_id", "status"]} />;
      case "analytics":
        return <CrudSection table="analytics_events" title="Analytics" description="Traffic, conversion and product trend events." fields={[{ name: "name", label: "Event", type: "text" as const, required: true }, { name: "source", label: "Source", type: "text" as const }, { name: "campaign", label: "Campaign", type: "text" as const }]} select="id,name,source,campaign,created_at" orderBy={{ column: "created_at", ascending: false }} searchKeys={["name", "source", "campaign"]} />;
      case "admins":
        return <CrudSection table="user_roles" title="Admin Users" description="Role management and access control." fields={[{ name: "user_id", label: "User ID", type: "text" as const, required: true }, { name: "role", label: "Role", type: "select" as const, options: [{ value: "super_admin", label: "Super admin" }, { value: "tech", label: "Tech" }, { value: "finance", label: "Finance" }, { value: "inventory", label: "Inventory" }, { value: "support", label: "Support" }, { value: "marketing", label: "Marketing" }] }]} select="*" orderBy={{ column: "created_at", ascending: false }} searchKeys={["user_id", "role"]} />;
      case "activity":
        return <CrudSection table="audit_logs" title="Activity Log" description="Audit trail for changes across the control center." fields={[{ name: "action", label: "Action", type: "text" as const }, { name: "entity", label: "Entity", type: "text" as const }, { name: "entity_id", label: "Entity ID", type: "text" as const }]} select="id,action,entity,entity_id,created_at" orderBy={{ column: "created_at", ascending: false }} searchKeys={["action", "entity", "entity_id"]} />;
      default:
        return <DashboardPanel />;
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-ink text-ink-foreground lg:w-72 lg:shrink-0">
          <div className="flex h-20 items-center justify-between border-b border-ink-foreground/10 px-5">
            <div>
              <span className="font-serif text-2xl tracking-[0.14em]">LIVORA</span>
              <p className="text-[10px] font-bold tracking-[0.28em] text-accent">CONTROL CENTER</p>
            </div>
            <Link to="/" className="text-[10px] underline text-ink-foreground/70">Storefront</Link>
          </div>
          <nav className="space-y-1 p-3">
            {moduleMeta.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  active === key ? "bg-accent text-accent-foreground" : "text-ink-foreground/75 hover:bg-ink-foreground/10"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-5 md:p-8">
          <header className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-1 text-3xl">{activeLabel}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1">Operations</span>
              <span>{session.user.email}</span>
            </div>
          </header>
          {moduleContent}
        </main>
      </div>
    </div>
  );
}

function TrendingUpIcon(props: React.ComponentProps<typeof Activity>) {
  return <Activity {...props} />;
}
