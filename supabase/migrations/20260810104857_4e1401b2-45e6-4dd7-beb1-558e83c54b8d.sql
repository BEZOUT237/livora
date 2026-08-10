
-- ROLES ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('super_admin','tech','finance','inventory','support','marketing','customer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  locale text NOT NULL DEFAULT 'tr',
  newsletter_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin','tech','finance','inventory','support','marketing')
  );
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_staff(auth.uid()));
CREATE POLICY "own profile write" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER t_profiles_upd BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- CATALOGUE -----------------------------------------------------------
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.publishers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_tr text NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact_name text, email text, phone text,
  city text, country text DEFAULT 'TR',
  currency text NOT NULL DEFAULT 'TRY',
  payment_terms text,
  lead_time_days int NOT NULL DEFAULT 7,
  moq int NOT NULL DEFAULT 1,
  discount_pct numeric(5,2) NOT NULL DEFAULT 0,
  notes text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn text NOT NULL UNIQUE,
  sku text UNIQUE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  publisher_id uuid REFERENCES public.publishers(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  book_language text NOT NULL DEFAULT 'EN',
  format text NOT NULL DEFAULT 'paperback',
  pages int,
  published_date date,
  description text,
  why_you_like_it text,
  cover_url text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(10,2),
  purchase_cost numeric(10,2) NOT NULL DEFAULT 0,
  purchase_currency text NOT NULL DEFAULT 'TRY',
  purchase_fx_rate numeric(12,4) NOT NULL DEFAULT 1,
  purchase_date date,
  shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  customs_cost numeric(10,2) NOT NULL DEFAULT 0,
  packaging_cost numeric(10,2) NOT NULL DEFAULT 0,
  stock_qty int NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  reserved_qty int NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
  reorder_threshold int NOT NULL DEFAULT 3,
  target_stock int NOT NULL DEFAULT 10,
  stock_state text NOT NULL DEFAULT 'in_stock',
  is_active boolean NOT NULL DEFAULT true,
  is_trending boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_demo boolean NOT NULL DEFAULT false,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  review_count int NOT NULL DEFAULT 0,
  units_sold int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_books_lang ON public.books(book_language);
CREATE INDEX idx_books_cat ON public.books(category_id);
CREATE INDEX idx_books_created ON public.books(created_at DESC);
CREATE INDEX idx_books_title ON public.books(title);

CREATE TABLE public.price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  old_price numeric(10,2), new_price numeric(10,2) NOT NULL,
  reason text, changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_tr text NOT NULL, title_en text NOT NULL, title_fr text NOT NULL,
  subtitle_tr text, subtitle_en text, subtitle_fr text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.collection_books (
  collection_id uuid NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  sort_order int NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, book_id)
);

CREATE TABLE public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title_tr text NOT NULL, title_en text NOT NULL, title_fr text NOT NULL,
  kind text NOT NULL DEFAULT 'collection',
  collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0
);

CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  label text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- COMMERCE ------------------------------------------------------------
CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text, full_name text NOT NULL, phone text NOT NULL,
  city text NOT NULL, district text NOT NULL, postal_code text,
  address_line text NOT NULL, is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('LVR-' || upper(substr(md5(random()::text),1,8))),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL, full_name text NOT NULL, phone text NOT NULL,
  city text NOT NULL, district text NOT NULL, postal_code text, address_line text NOT NULL,
  status text NOT NULL DEFAULT 'pending_payment',
  payment_provider text NOT NULL DEFAULT 'manual',
  payment_status text NOT NULL DEFAULT 'pending',
  shipping_carrier text,
  tracking_number text,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  shipping_total numeric(10,2) NOT NULL DEFAULT 0,
  discount_total numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  coupon_code text,
  ambassador_code text,
  utm_source text, utm_campaign text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created ON public.orders(created_at DESC);

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
  title text NOT NULL, isbn text, cover_url text,
  unit_price numeric(10,2) NOT NULL,
  unit_cost numeric(10,2) NOT NULL DEFAULT 0,
  quantity int NOT NULL CHECK (quantity > 0),
  line_total numeric(10,2) NOT NULL
);

CREATE TABLE public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, book_id)
);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text, comment text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (book_id, user_id)
);

CREATE TABLE public.promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric(10,2) NOT NULL,
  min_cart_total numeric(10,2) NOT NULL DEFAULT 0,
  max_discount numeric(10,2),
  usage_limit int,
  used_count int NOT NULL DEFAULT 0,
  starts_at timestamptz, ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- OPS -----------------------------------------------------------------
CREATE TABLE public.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL UNIQUE DEFAULT ('PO-' || upper(substr(md5(random()::text),1,6))),
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  currency text NOT NULL DEFAULT 'TRY',
  fx_rate numeric(12,4) NOT NULL DEFAULT 1,
  expected_at date,
  notes text,
  total_cost numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  received_qty int NOT NULL DEFAULT 0,
  unit_cost numeric(10,2) NOT NULL DEFAULT 0
);
CREATE TABLE public.inventory_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  delta int NOT NULL,
  reason text NOT NULL,
  reference text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  website text,
  is_active boolean NOT NULL DEFAULT true
);
CREATE TABLE public.competitor_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id uuid NOT NULL REFERENCES public.competitors(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  url text,
  source text NOT NULL DEFAULT 'manual',
  observed_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.ambassadors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  code text NOT NULL UNIQUE,
  commission_pct numeric(5,2) NOT NULL DEFAULT 5,
  clicks int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text,
  cover_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid,
  session_id text,
  book_id uuid,
  source text, campaign text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  locale text NOT NULL DEFAULT 'tr',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- GRANTS + RLS --------------------------------------------------------
DO $$
DECLARE t text;
  public_read text[] := ARRAY['authors','publishers','categories','books','collections','collection_books','homepage_sections','blog_posts','promotions'];
  staff_only text[] := ARRAY['suppliers','purchase_orders','purchase_order_items','inventory_movements','competitors','competitor_prices','ambassadors','audit_logs','settings','price_history'];
BEGIN
  FOREACH t IN ARRAY public_read || staff_only || ARRAY['addresses','orders','order_items','wishlist_items','reviews','analytics_events','newsletter_subscribers'] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "staff manage %s" ON public.%I FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()))', t, t);
  END LOOP;

  FOREACH t IN ARRAY public_read LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('CREATE POLICY "public read %s" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t, t);
  END LOOP;
END $$;

-- customer-facing policies
CREATE POLICY "own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own wishlist" ON public.wishlist_items FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own order items read" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "approved reviews read" ON public.reviews FOR SELECT TO anon, authenticated USING (is_approved OR auth.uid() = user_id);
CREATE POLICY "own reviews write" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own reviews update" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
GRANT SELECT ON public.reviews TO anon;
GRANT INSERT ON public.newsletter_subscribers TO anon;
CREATE POLICY "anyone subscribes" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT INSERT ON public.analytics_events TO anon;
CREATE POLICY "anyone tracks" ON public.analytics_events FOR INSERT TO anon, authenticated WITH CHECK (true);

-- SEED (clearly marked demo data) --------------------------------------
INSERT INTO public.settings (key, value, label, category) VALUES
 ('free_shipping_threshold','750','Free shipping threshold (TL)','commerce'),
 ('flat_shipping_fee','59.90','Flat shipping fee (TL)','commerce'),
 ('min_margin_pct','22','Minimum margin %','finance'),
 ('low_stock_threshold','3','Low stock threshold','inventory'),
 ('safety_stock','2','Safety stock','inventory'),
 ('stock_reservation_minutes','20','Stock reservation (minutes)','inventory'),
 ('default_delivery_estimate','2-4 days','Default delivery estimate','commerce'),
 ('fx_alert_threshold_pct','3','FX alert threshold %','finance'),
 ('competitor_alert_pct','12','Competitor price alert %','pricing'),
 ('max_discount_pct','30','Maximum discount %','pricing'),
 ('payment_fee_pct','2.9','Payment provider fee %','finance');

INSERT INTO public.categories (slug,name_tr,name_en,name_fr,sort_order) VALUES
 ('fiction','Kurgu','Fiction','Fiction',1),
 ('fantasy','Fantastik','Fantasy','Fantastique',2),
 ('romance','Romantik','Romance','Romance',3),
 ('mystery','Polisiye','Mystery & Thriller','Policier',4),
 ('business','İş & Kariyer','Business','Business',5),
 ('self-development','Kişisel Gelişim','Self-Development','Développement personnel',6),
 ('classics','Klasikler','Classics','Classiques',7),
 ('academic','Akademik','Academic','Académique',8);

INSERT INTO public.competitors (name,website) VALUES
 ('D&R','https://www.dr.com.tr'),('Kitapyurdu','https://www.kitapyurdu.com'),
 ('Amazon Türkiye','https://www.amazon.com.tr'),('İdefix','https://www.idefix.com');

INSERT INTO public.suppliers (name,contact_name,email,city,country,currency,lead_time_days,moq,discount_pct,notes,is_active) VALUES
 ('DEMO Supplier — EU Wholesale','Demo Contact','demo@example.com','Istanbul','TR','EUR',12,10,18,'DEMO record — replace with a real supplier',true),
 ('DEMO Supplier — Local Distributor','Demo Contact','demo2@example.com','Bolu','TR','TRY',4,5,12,'DEMO record — replace with a real supplier',true);

INSERT INTO public.authors (name,slug) VALUES
 ('Demo Author A','demo-author-a'),('Demo Author B','demo-author-b'),
 ('Demo Author C','demo-author-c'),('Demo Author D','demo-author-d');
INSERT INTO public.publishers (name,slug) VALUES ('Demo Press','demo-press'),('Éditions Démo','editions-demo');

INSERT INTO public.books (isbn,sku,slug,title,subtitle,author_id,publisher_id,category_id,book_language,format,pages,published_date,description,why_you_like_it,price,compare_at_price,purchase_cost,purchase_currency,purchase_fx_rate,shipping_cost,stock_qty,is_active,is_trending,is_bestseller,is_new_arrival,is_demo,rating,review_count,units_sold)
SELECT d.isbn, 'SKU-'||d.n, d.slug, d.title, d.subtitle,
  (SELECT id FROM public.authors ORDER BY slug LIMIT 1 OFFSET (d.n % 4)),
  (SELECT id FROM public.publishers ORDER BY slug LIMIT 1 OFFSET (d.n % 2)),
  (SELECT id FROM public.categories WHERE slug = d.cat),
  d.lang, 'paperback', 220 + d.n*13, date '2024-01-15' + (d.n*17),
  'DEMO product. Placeholder description for '||d.title||'. Replace with real catalogue data before launch.',
  'A short editorial note explaining why readers love this title.',
  d.price, d.price * 1.18, d.cost, d.cur, CASE WHEN d.cur='EUR' THEN 47.5 ELSE 1 END, 25,
  d.stock, true, d.n % 3 = 0, d.n % 4 = 0, d.n % 5 = 0, true,
  3.9 + ((d.n % 10)::numeric / 10), 4 + d.n, 3 + d.n * 2
FROM (VALUES
 (1,'9780000000001','demo-the-quiet-algorithm','The Quiet Algorithm','A novel of code and consequence','EN','fiction',429.00,180.00,'EUR',7),
 (2,'9780000000002','demo-midnight-in-bolu','Midnight in Bolu','A thriller','EN','mystery',389.00,160.00,'EUR',4),
 (3,'9780000000003','demo-la-lumiere-des-pages','La Lumière des Pages','Roman','FR','fiction',459.00,190.00,'EUR',2),
 (4,'9780000000004','demo-compounding-focus','Compounding Focus','Habits for builders','EN','business',519.00,210.00,'EUR',12),
 (5,'9780000000005','demo-le-capital-du-temps','Le Capital du Temps','Essai','FR','business',489.00,200.00,'EUR',0),
 (6,'9780000000006','demo-ember-crown','Ember Crown','Book one of the Ember cycle','EN','fantasy',549.00,225.00,'EUR',9),
 (7,'9780000000007','demo-letters-we-never-sent','Letters We Never Sent','A romance','EN','romance',349.00,140.00,'EUR',6),
 (8,'9780000000008','demo-les-classiques-retrouves','Les Classiques Retrouvés','Anthologie','FR','classics',399.00,150.00,'EUR',3),
 (9,'9780000000009','demo-the-slow-fix','The Slow Fix','Self-development','EN','self-development',329.00,130.00,'EUR',15),
 (10,'9780000000010','demo-statistics-for-founders','Statistics for Founders','Academic','EN','academic',629.00,260.00,'EUR',2),
 (11,'9780000000011','demo-paris-sous-la-pluie','Paris sous la Pluie','Roman','FR','romance',369.00,145.00,'EUR',5),
 (12,'9780000000012','demo-the-last-ledger','The Last Ledger','Mystery','EN','mystery',419.00,170.00,'EUR',1)
) AS d(n,isbn,slug,title,subtitle,lang,cat,price,cost,cur,stock);

UPDATE public.books SET stock_state = CASE WHEN stock_qty = 0 THEN 'available_to_order' WHEN stock_qty <= 3 THEN 'low_stock' ELSE 'in_stock' END;

INSERT INTO public.collections (slug,title_tr,title_en,title_fr,sort_order) VALUES
 ('trending','Şu An Trend','Trending Now','Tendances',1),
 ('bestsellers','Çok Satanlar','Best Sellers','Meilleures ventes',2),
 ('new-arrivals','Yeni Gelenler','New Arrivals','Nouveautés',3),
 ('english','İngilizce Kitaplar','English Books','Livres en anglais',4),
 ('french','Fransızca Kitaplar','French Books','Livres en français',5),
 ('under-500','500 TL Altı','Under 500 TL','Moins de 500 TL',6);

INSERT INTO public.homepage_sections (key,title_tr,title_en,title_fr,kind,collection_id,sort_order,is_enabled)
SELECT c.slug, c.title_tr, c.title_en, c.title_fr, 'collection', c.id, c.sort_order, true FROM public.collections c;

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, row_number() OVER (PARTITION BY c.id ORDER BY b.created_at)
FROM public.collections c JOIN public.books b ON (
  (c.slug='trending' AND b.is_trending) OR
  (c.slug='bestsellers' AND b.is_bestseller) OR
  (c.slug='new-arrivals' AND b.is_new_arrival) OR
  (c.slug='english' AND b.book_language='EN') OR
  (c.slug='french' AND b.book_language='FR') OR
  (c.slug='under-500' AND b.price < 500)
);
