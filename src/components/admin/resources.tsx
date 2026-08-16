import type { Column, Field, Row } from "./ResourceManager";
import { formatTRY } from "@/lib/format";

const LANGS = [
  { value: "EN", label: "English" },
  { value: "FR", label: "Français" },
];

const money = (k: string) => (r: Row) => formatTRY(Number(r[k] ?? 0));

export const bookColumns: Column[] = [
  {
    name: "cover_url",
    label: "Cover",
    render: (r) =>
      r["cover_url"] ? (
        <img
          src={String(r["cover_url"])}
          alt=""
          className="h-14 w-10 rounded object-cover"
          loading="lazy"
        />
      ) : (
        <div className="grid h-14 w-10 place-items-center rounded bg-secondary text-[9px] text-muted-foreground">
          none
        </div>
      ),
  },
  { name: "title", label: "Title" },
  { name: "book_language", label: "Lang" },
  { name: "price", label: "Price", render: money("price") },
  { name: "stock_qty", label: "Stock" },
  { name: "is_active", label: "Active" },
];

export const bookFields: Field[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "subtitle", label: "Subtitle", type: "text" },
  { name: "slug", label: "Slug", type: "text", required: true, help: "URL segment, e.g. the-quiet-algorithm" },
  { name: "isbn", label: "ISBN", type: "text", required: true },
  { name: "sku", label: "SKU", type: "text" },
  { name: "cover_url", label: "Cover URL", type: "text", placeholder: "/covers/my-book.jpg or https://…" },
  { name: "author_id", label: "Author", type: "select", lookup: { table: "authors", value: "id", label: "name" } },
  { name: "publisher_id", label: "Publisher", type: "select", lookup: { table: "publishers", value: "id", label: "name" } },
  { name: "category_id", label: "Category", type: "select", lookup: { table: "categories", value: "id", label: "name_en" } },
  { name: "supplier_id", label: "Supplier", type: "select", lookup: { table: "suppliers", value: "id", label: "name" } },
  { name: "book_language", label: "Language", type: "select", options: LANGS, default: "EN", required: true },
  {
    name: "format",
    label: "Format",
    type: "select",
    options: [
      { value: "paperback", label: "Paperback" },
      { value: "hardcover", label: "Hardcover" },
    ],
    default: "paperback",
  },
  { name: "pages", label: "Pages", type: "number" },
  { name: "published_date", label: "Published", type: "date" },
  { name: "price", label: "Price (TRY)", type: "number", step: "0.01", required: true, default: 0 },
  { name: "compare_at_price", label: "Compare-at price", type: "number", step: "0.01" },
  { name: "purchase_cost", label: "Purchase cost", type: "number", step: "0.01", default: 0 },
  { name: "purchase_currency", label: "Purchase currency", type: "select", options: [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "TRY", label: "TRY" },
  ], default: "USD" },
  { name: "purchase_fx_rate", label: "FX rate to TRY", type: "number", step: "0.0001", default: 1 },
  { name: "shipping_cost", label: "Shipping cost", type: "number", step: "0.01", default: 0 },
  { name: "customs_cost", label: "Customs cost", type: "number", step: "0.01", default: 0 },
  { name: "packaging_cost", label: "Packaging cost", type: "number", step: "0.01", default: 0 },
  { name: "stock_qty", label: "Stock qty", type: "number", default: 0 },
  { name: "reorder_threshold", label: "Reorder threshold", type: "number", default: 3 },
  { name: "target_stock", label: "Target stock", type: "number", default: 12 },
  { name: "stock_state", label: "Stock state", type: "select", options: [
    { value: "in_stock", label: "In stock" },
    { value: "low_stock", label: "Low stock" },
    { value: "out_of_stock", label: "Out of stock" },
    { value: "preorder", label: "Pre-order" },
  ], default: "in_stock" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "why_you_like_it", label: "Why you'll like it", type: "textarea" },
  { name: "is_active", label: "Active", type: "boolean", default: true },
  { name: "is_trending", label: "Trending", type: "boolean" },
  { name: "is_bestseller", label: "Bestseller", type: "boolean" },
  { name: "is_new_arrival", label: "New arrival", type: "boolean" },
];

export const authorColumns: Column[] = [
  { name: "name", label: "Name" },
  { name: "slug", label: "Slug" },
  { name: "bio", label: "Bio", className: "max-w-md truncate" },
];

export const authorFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "bio", label: "Bio", type: "textarea" },
];

export const publisherColumns: Column[] = [
  { name: "name", label: "Name" },
  { name: "slug", label: "Slug" },
];

export const publisherFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true },
];

export const supplierColumns: Column[] = [
  { name: "name", label: "Name" },
  { name: "country", label: "Country" },
  { name: "currency", label: "Currency" },
  { name: "lead_time_days", label: "Lead time" },
  { name: "is_active", label: "Active" },
];

export const supplierFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "contact_name", label: "Contact", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "currency", label: "Currency", type: "select", options: [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "TRY", label: "TRY" },
  ], default: "USD", required: true },
  { name: "payment_terms", label: "Payment terms", type: "text" },
  { name: "lead_time_days", label: "Lead time (days)", type: "number", default: 14 },
  { name: "moq", label: "MOQ", type: "number", default: 1 },
  { name: "discount_pct", label: "Discount %", type: "number", step: "0.01", default: 0 },
  { name: "notes", label: "Notes", type: "textarea" },
  { name: "is_active", label: "Active", type: "boolean", default: true },
];

export const poColumns: Column[] = [
  { name: "po_number", label: "PO" },
  { name: "status", label: "Status" },
  { name: "currency", label: "Currency" },
  { name: "fx_rate", label: "FX" },
  { name: "expected_at", label: "Expected" },
  { name: "total_cost", label: "Total", render: money("total_cost") },
];

export const poFields: Field[] = [
  { name: "po_number", label: "PO number", type: "text", required: true },
  { name: "supplier_id", label: "Supplier", type: "select", lookup: { table: "suppliers", value: "id", label: "name" } },
  { name: "status", label: "Status", type: "select", options: [
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "partial", label: "Partially received" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
  ], default: "draft", required: true },
  { name: "currency", label: "Currency", type: "select", options: [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "TRY", label: "TRY" },
  ], default: "USD", required: true },
  { name: "fx_rate", label: "FX rate", type: "number", step: "0.0001", default: 1 },
  { name: "expected_at", label: "Expected date", type: "date" },
  { name: "total_cost", label: "Total cost", type: "number", step: "0.01", default: 0 },
  { name: "notes", label: "Notes", type: "textarea" },
];

export const poItemColumns: Column[] = [
  { name: "purchase_order_id", label: "PO id", className: "max-w-[120px] truncate text-xs" },
  { name: "book_id", label: "Book id", className: "max-w-[120px] truncate text-xs" },
  { name: "quantity", label: "Qty" },
  { name: "received_qty", label: "Received" },
  { name: "unit_cost", label: "Unit cost" },
];

export const poItemFields: Field[] = [
  {
    name: "purchase_order_id",
    label: "Purchase order",
    type: "select",
    required: true,
    lookup: { table: "purchase_orders", value: "id", label: "po_number" },
  },
  { name: "book_id", label: "Book", type: "select", lookup: { table: "books", value: "id", label: "title" } },
  { name: "quantity", label: "Quantity", type: "number", default: 1, required: true },
  { name: "received_qty", label: "Received qty", type: "number", default: 0 },
  { name: "unit_cost", label: "Unit cost", type: "number", step: "0.01", default: 0, required: true },
];

export const promoColumns: Column[] = [
  { name: "code", label: "Code" },
  { name: "discount_type", label: "Type" },
  { name: "discount_value", label: "Value" },
  { name: "min_cart_total", label: "Min cart", render: money("min_cart_total") },
  { name: "used_count", label: "Used" },
  { name: "is_active", label: "Active" },
];

export const promoFields: Field[] = [
  { name: "code", label: "Code", type: "text", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "discount_type", label: "Discount type", type: "select", options: [
    { value: "percent", label: "Percent" },
    { value: "fixed", label: "Fixed amount" },
    { value: "free_shipping", label: "Free shipping" },
  ], default: "percent", required: true },
  { name: "discount_value", label: "Discount value", type: "number", step: "0.01", default: 0, required: true },
  { name: "min_cart_total", label: "Minimum cart total", type: "number", step: "0.01", default: 0 },
  { name: "max_discount", label: "Max discount", type: "number", step: "0.01" },
  { name: "usage_limit", label: "Usage limit", type: "number" },
  { name: "is_active", label: "Active", type: "boolean", default: true },
];

export const sectionColumns: Column[] = [
  { name: "sort_order", label: "#" },
  { name: "key", label: "Key" },
  { name: "title_en", label: "Title (EN)" },
  { name: "title_fr", label: "Title (FR)" },
  { name: "title_tr", label: "Title (TR)" },
  { name: "kind", label: "Kind" },
  { name: "is_enabled", label: "Enabled" },
];

export const sectionFields: Field[] = [
  { name: "key", label: "Key", type: "text", required: true },
  { name: "title_tr", label: "Title (TR)", type: "text", required: true },
  { name: "title_en", label: "Title (EN)", type: "text", required: true },
  { name: "title_fr", label: "Title (FR)", type: "text", required: true },
  { name: "kind", label: "Kind", type: "select", options: [
    { value: "collection", label: "Collection" },
    { value: "trending", label: "Trending" },
    { value: "bestsellers", label: "Bestsellers" },
    { value: "new_arrivals", label: "New arrivals" },
  ], default: "collection", required: true },
  {
    name: "collection_id",
    label: "Collection",
    type: "select",
    lookup: { table: "collections", value: "id", label: "title_en" },
  },
  { name: "sort_order", label: "Sort order", type: "number", default: 0 },
  { name: "is_enabled", label: "Enabled", type: "boolean", default: true },
];

export const collectionColumns: Column[] = [
  { name: "sort_order", label: "#" },
  { name: "slug", label: "Slug" },
  { name: "title_en", label: "Title (EN)" },
  { name: "is_active", label: "Active" },
];

export const collectionFields: Field[] = [
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "title_tr", label: "Title (TR)", type: "text", required: true },
  { name: "title_en", label: "Title (EN)", type: "text", required: true },
  { name: "title_fr", label: "Title (FR)", type: "text", required: true },
  { name: "subtitle_tr", label: "Subtitle (TR)", type: "text" },
  { name: "subtitle_en", label: "Subtitle (EN)", type: "text" },
  { name: "subtitle_fr", label: "Subtitle (FR)", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number", default: 0 },
  { name: "is_active", label: "Active", type: "boolean", default: true },
];
