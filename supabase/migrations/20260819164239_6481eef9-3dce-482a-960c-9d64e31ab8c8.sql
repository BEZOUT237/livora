-- 1. Extra product fields -------------------------------------------------
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS edition text,
  ADD COLUMN IF NOT EXISTS original_language text,
  ADD COLUMN IF NOT EXISTS dimensions text,
  ADD COLUMN IF NOT EXISTS weight_grams integer,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS author_bio text,
  ADD COLUMN IF NOT EXISTS selling_points text,
  ADD COLUMN IF NOT EXISTS quotes text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS seo_keywords text,
  ADD COLUMN IF NOT EXISTS tax_rate numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS supplier_sku text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cover_alt text,
  ADD COLUMN IF NOT EXISTS is_preorder boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_booktok boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_student_pick boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS internal_note text;

ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS description_tr text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS description_fr text,
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

ALTER TABLE public.homepage_sections
  ADD COLUMN IF NOT EXISTS subtitle_tr text,
  ADD COLUMN IF NOT EXISTS subtitle_en text,
  ADD COLUMN IF NOT EXISTS subtitle_fr text;

-- 2. Editable site content -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
  key text PRIMARY KEY,
  group_name text NOT NULL DEFAULT 'general',
  label text NOT NULL,
  kind text NOT NULL DEFAULT 'text',
  value_tr text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT '',
  value_fr text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read site content" ON public.site_content;
CREATE POLICY "public read site content" ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "staff manage site content" ON public.site_content;
CREATE POLICY "staff manage site content" ON public.site_content
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
DROP TRIGGER IF EXISTS t_site_content_upd ON public.site_content;
CREATE TRIGGER t_site_content_upd BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Media library ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  storage_path text,
  file_name text NOT NULL,
  alt_text text,
  folder text NOT NULL DEFAULT 'general',
  content_type text,
  size_bytes integer,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media_assets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read media" ON public.media_assets;
CREATE POLICY "public read media" ON public.media_assets
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "staff manage media" ON public.media_assets;
CREATE POLICY "staff manage media" ON public.media_assets
  TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 4. Order timeline --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_events TO authenticated;
GRANT INSERT ON public.order_events TO anon;
GRANT ALL ON public.order_events TO service_role;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "staff read order events" ON public.order_events;
CREATE POLICY "staff read order events" ON public.order_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "anyone create order events" ON public.order_events;
CREATE POLICY "anyone create order events" ON public.order_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 5. Cover files now served statically ------------------------------------
UPDATE public.books SET cover_url = '/covers/' || slug || '.webp'
WHERE slug IN ('effet-cumule','psychologie-de-l-argent','secrets-esprit-millionnaire',
               'osez-reussir','plus-malin-que-le-diable','second-chance','the-one-thing');

-- 6. The 8th book ----------------------------------------------------------
INSERT INTO public.publishers (name, slug)
VALUES ('MK Publications', 'mk-publications')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.authors (name, slug)
VALUES ('Mary Shelley', 'mary-shelley')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (slug, name_tr, name_en, name_fr, sort_order)
VALUES ('fiction', 'Kurgu', 'Fiction', 'Fiction', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.books
  (slug, title, author_id, publisher_id, category_id, book_language, cover_url,
   price, price_usd, price_eur, stock_qty, stock_state, is_active, is_demo)
VALUES
  ('frankenstein', 'Frankenstein',
   (SELECT id FROM public.authors WHERE slug = 'mary-shelley'),
   (SELECT id FROM public.publishers WHERE slug = 'mk-publications'),
   (SELECT id FROM public.categories WHERE slug = 'fiction'),
   'EN', '/covers/frankenstein.png',
   700, 15, 12.85, 0, 'available_to_order', true, false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE b.slug = 'frankenstein' AND c.slug IN ('livora-picks','english')
ON CONFLICT DO NOTHING;

-- 7. Global settings -------------------------------------------------------
INSERT INTO public.settings (key, value, label, category) VALUES
  ('contact_city',        'Bolu, Türkiye',            'Contact city',          'contact'),
  ('contact_email',       'yemelink@gmail.com',       'Contact e-mail',        'contact'),
  ('contact_phone',       '+90 501 024 20 25',        'Contact phone',         'contact'),
  ('social_instagram',    '',                         'Instagram URL',         'contact'),
  ('social_tiktok',       '',                         'TikTok URL',            'contact'),
  ('bank_name',           'Ziraat Bankası',           'Bank name',             'payment'),
  ('bank_iban',           'TR74 0001 0090 1078 7294 7050 01', 'IBAN',          'payment'),
  ('bank_account_holder', 'NIKEL BIENVENU FEUMO FOLENG', 'Account holder',     'payment'),
  ('bank_currency',       'TRY',                      'Transfer currency',     'payment'),
  ('payment_deadline_hours', '48',                    'Payment deadline (h)',  'payment')
ON CONFLICT (key) DO NOTHING;