import { supabase } from "@/integrations/supabase/client";

export type BookRow = {
  id: string;
  isbn: string;
  slug: string;
  title: string;
  subtitle: string | null;
  book_language: string;
  format: string;
  pages: number | null;
  published_date: string | null;
  description: string | null;
  why_you_like_it: string | null;
  cover_url: string | null;
  price: number;
  compare_at_price: number | null;
  stock_qty: number;
  reserved_qty: number;
  stock_state: string;
  is_demo: boolean;
  is_trending: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  rating: number;
  review_count: number;
  units_sold: number;
  category_id: string | null;
  created_at: string;
  authors?: { name: string; slug: string } | null;
  publishers?: { name: string } | null;
  categories?: { slug: string; name_tr: string; name_en: string; name_fr: string } | null;
};

export const BOOK_SELECT =
  "id,isbn,slug,title,subtitle,book_language,format,pages,published_date,description,why_you_like_it,cover_url,price,compare_at_price,stock_qty,reserved_qty,stock_state,is_demo,is_trending,is_bestseller,is_new_arrival,rating,review_count,units_sold,category_id,created_at,authors(name,slug),publishers(name),categories(slug,name_tr,name_en,name_fr)";

export type BookQuery = {
  search?: string | undefined;
  language?: string | undefined;
  category?: string | undefined;
  sort?: string | undefined;
  maxPrice?: number | undefined;
  minPrice?: number | undefined;
  inStockOnly?: boolean | undefined;
  limit?: number | undefined;
};

export async function fetchBooks(opts: BookQuery): Promise<BookRow[]> {
  let q = supabase.from("books").select(BOOK_SELECT).eq("is_active", true);

  if (opts.search) q = q.or(`title.ilike.%${opts.search}%,isbn.ilike.%${opts.search}%,subtitle.ilike.%${opts.search}%`);
  if (opts.language) q = q.eq("book_language", opts.language);
  if (opts.category) q = q.eq("categories.slug", opts.category);
  if (opts.minPrice != null) q = q.gte("price", opts.minPrice);
  if (opts.maxPrice != null) q = q.lte("price", opts.maxPrice);
  if (opts.inStockOnly) q = q.gt("stock_qty", 0);

  switch (opts.sort) {
    case "price_asc":
      q = q.order("price", { ascending: true });
      break;
    case "price_desc":
      q = q.order("price", { ascending: false });
      break;
    case "newest":
      q = q.order("created_at", { ascending: false });
      break;
    case "bestsellers":
      q = q.order("units_sold", { ascending: false });
      break;
    default:
      q = q.order("is_trending", { ascending: false }).order("units_sold", { ascending: false });
  }

  const { data, error } = await q.limit(opts.limit ?? 60);
  if (error) throw error;
  let rows = (data ?? []) as unknown as BookRow[];
  if (opts.category) rows = rows.filter((r) => r.categories?.slug === opts.category);
  return rows;
}

export async function fetchBookBySlug(slug: string): Promise<BookRow | null> {
  const { data, error } = await supabase.from("books").select(BOOK_SELECT).eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as unknown as BookRow) ?? null;
}

export async function fetchHomepageSections() {
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("id,key,title_tr,title_en,title_fr,is_enabled,sort_order,collection_id")
    .eq("is_enabled", true)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function fetchCollectionBooks(collectionId: string): Promise<BookRow[]> {
  const { data, error } = await supabase
    .from("collection_books")
    .select(`sort_order, books(${BOOK_SELECT})`)
    .eq("collection_id", collectionId)
    .order("sort_order")
    .limit(12);
  if (error) throw error;
  return ((data ?? []) as unknown as { books: BookRow }[]).map((r) => r.books).filter(Boolean);
}

export async function fetchSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("settings").select("key,value");
  if (error) return {};
  return Object.fromEntries((data ?? []).map((s) => [s.key, s.value]));
}

export const DEFAULT_SITE_CONTENT: Record<string, string> = {
  contact_email: "yemelink@gmail.com",
  contact_phone: "+90 501 024 20 25",
  contact_address: "Bolu, Türkiye",
  bank_name: "Ziraat Bankası",
  bank_iban: "TR74 0001 0090 1078 7294 7050 01",
  bank_account_holder: "NIKEL BIENVENU FEUMO FOLENG",
  footer_about:
    "The smart international bookstore for Türkiye. Curated English & French titles, shipped from Bolu.",
  home_hero_title: "English and French books, intelligently curated.",
  home_hero_subtitle:
    "The world's most talked-about titles, with fast delivery and honest pricing.",
  home_hero_eyebrow: "From Bolu to all of Türkiye",
  about_intro:
    "LIVORA is an independent bookstore based in Bolu, specialised in new English and French titles.",
  brand_name: "LIVORA",
  brand_tagline: "INTERNATIONAL BOOKS",
};

export async function fetchSiteContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("settings")
    .select("key,value")
    .in("key", Object.keys(DEFAULT_SITE_CONTENT));
  if (error) return DEFAULT_SITE_CONTENT;
  const entries = Object.fromEntries((data ?? []).map((s) => [s.key, String(s.value ?? "")]));
  return { ...DEFAULT_SITE_CONTENT, ...entries };
}

export function getSiteValue(settings: Record<string, string> | undefined, key: string, fallback: string) {
  return settings?.[key] || fallback;
}

/** Public defaults; settings table is staff-only readable. */
export const PUBLIC_DEFAULTS = {
  freeShippingThreshold: 750,
  flatShippingFee: 59.9,
  deliveryEstimate: "2-4",
};

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= PUBLIC_DEFAULTS.freeShippingThreshold ? 0 : PUBLIC_DEFAULTS.flatShippingFee;
}
