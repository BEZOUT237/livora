-- 1. Schema changes -------------------------------------------------------
ALTER TABLE public.books ALTER COLUMN isbn DROP NOT NULL;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS price_usd numeric(10,2);
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS price_eur numeric(10,2);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'TRY';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_path text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof_uploaded_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_verified_at timestamptz;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_verified_by uuid;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_review_note text;

-- Guests and customers must be able to create their own orders.
DROP POLICY IF EXISTS "anyone can create orders" ON public.orders;
CREATE POLICY "anyone can create orders" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anyone can create order items" ON public.order_items;
CREATE POLICY "anyone can create order items" ON public.order_items
  FOR INSERT TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;

-- 2. Purge every demo / placeholder record --------------------------------
DELETE FROM public.collection_books;
DELETE FROM public.homepage_sections;
DELETE FROM public.collections;
DELETE FROM public.competitor_prices;
DELETE FROM public.price_history;
DELETE FROM public.inventory_movements;
DELETE FROM public.reviews;
DELETE FROM public.wishlist_items;
DELETE FROM public.purchase_order_items;
DELETE FROM public.books;
DELETE FROM public.authors;
DELETE FROM public.publishers;
DELETE FROM public.categories;

-- 3. Real categories -------------------------------------------------------
INSERT INTO public.categories (slug, name_tr, name_en, name_fr, sort_order) VALUES
  ('personal-development', 'Kişisel Gelişim', 'Personal Development', 'Développement personnel', 1),
  ('finance-money',        'Finans ve Para',  'Finance & Money',      'Finance et argent',       2),
  ('productivity',         'Verimlilik',      'Productivity',         'Productivité',            3);

-- 4. Real authors ----------------------------------------------------------
INSERT INTO public.authors (name, slug) VALUES
  ('Darren Hardy', 'darren-hardy'),
  ('T. Harv Eker', 't-harv-eker'),
  ('Marc Boilard, Steven Finn, Sylvain Guimond, David Larose, Stephan Maighan, Brigitte Morel, Jimmy Sévigny, Mélanie Turgeon', 'osez-reussir-collectif'),
  ('Napoleon Hill', 'napoleon-hill'),
  ('Robert T. Kiyosaki', 'robert-t-kiyosaki'),
  ('Gary Keller & Jay Papasan', 'gary-keller-jay-papasan'),
  ('Morgan Housel', 'morgan-housel');

-- 5. The seven founding books ---------------------------------------------
INSERT INTO public.books
  (slug, title, subtitle, author_id, category_id, book_language, cover_url,
   price, price_usd, price_eur, stock_qty, stock_state, is_active, is_demo)
VALUES
  ('effet-cumule', 'L''Effet Cumulé', 'Décuplez votre réussite !',
   (SELECT id FROM public.authors WHERE slug = 'darren-hardy'),
   (SELECT id FROM public.categories WHERE slug = 'productivity'),
   'FR', '/covers/effet-cumule.webp',
   960, 20, 17.30, 0, 'available_to_order', true, false),

  ('secrets-esprit-millionnaire', 'Les Secrets d''un Esprit Millionnaire', NULL,
   (SELECT id FROM public.authors WHERE slug = 't-harv-eker'),
   (SELECT id FROM public.categories WHERE slug = 'finance-money'),
   'FR', '/covers/secrets-esprit-millionnaire.webp',
   960, 20, 17.30, 0, 'available_to_order', true, false),

  ('osez-reussir', 'Osez réussir !', NULL,
   (SELECT id FROM public.authors WHERE slug = 'osez-reussir-collectif'),
   (SELECT id FROM public.categories WHERE slug = 'personal-development'),
   'FR', '/covers/osez-reussir.webp',
   960, 20, 17.30, 0, 'available_to_order', true, false),

  ('plus-malin-que-le-diable', 'Plus malin que le Diable', 'Le secret de la liberté et du succès',
   (SELECT id FROM public.authors WHERE slug = 'napoleon-hill'),
   (SELECT id FROM public.categories WHERE slug = 'personal-development'),
   'FR', '/covers/plus-malin-que-le-diable.webp',
   960, 20, 17.30, 0, 'available_to_order', true, false),

  ('second-chance', 'Second Chance', 'For Your Money, Your Life and Our World',
   (SELECT id FROM public.authors WHERE slug = 'robert-t-kiyosaki'),
   (SELECT id FROM public.categories WHERE slug = 'finance-money'),
   'EN', '/covers/second-chance.webp',
   800, 17, 14.70, 0, 'available_to_order', true, false),

  ('the-one-thing', 'The One Thing', 'Passez à l''essentiel',
   (SELECT id FROM public.authors WHERE slug = 'gary-keller-jay-papasan'),
   (SELECT id FROM public.categories WHERE slug = 'productivity'),
   'FR', '/covers/the-one-thing.webp',
   1100, 23, 19.99, 0, 'available_to_order', true, false),

  ('psychologie-de-l-argent', 'La Psychologie de l''Argent', NULL,
   (SELECT id FROM public.authors WHERE slug = 'morgan-housel'),
   (SELECT id FROM public.categories WHERE slug = 'finance-money'),
   'FR', '/covers/psychologie-de-l-argent.webp',
   960, 20, 17.30, 0, 'available_to_order', true, false);

-- 6. Collections -----------------------------------------------------------
INSERT INTO public.collections (slug, title_tr, title_en, title_fr, subtitle_tr, subtitle_en, subtitle_fr, sort_order) VALUES
  ('livora-picks', 'LIVORA Seçkisi', 'LIVORA Picks', 'Sélection LIVORA',
   'Kuruluş koleksiyonumuz', 'Our founding collection', 'Notre collection fondatrice', 1),
  ('personal-development', 'Kişisel Gelişim', 'Personal Development', 'Développement personnel', NULL, NULL, NULL, 2),
  ('finance-money', 'Finans ve Para', 'Finance & Money', 'Finance et argent', NULL, NULL, NULL, 3),
  ('productivity', 'Verimlilik', 'Productivity', 'Productivité', NULL, NULL, NULL, 4),
  ('french', 'Fransızca Kitaplar', 'French Books', 'Livres en français', NULL, NULL, NULL, 5),
  ('english', 'İngilizce Kitaplar', 'English Books', 'Livres en anglais', NULL, NULL, NULL, 6);

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b WHERE c.slug = 'livora-picks';

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE c.slug = 'personal-development'
  AND b.slug IN ('effet-cumule','secrets-esprit-millionnaire','osez-reussir','plus-malin-que-le-diable','second-chance','the-one-thing');

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE c.slug = 'finance-money'
  AND b.slug IN ('secrets-esprit-millionnaire','second-chance','psychologie-de-l-argent','plus-malin-que-le-diable');

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE c.slug = 'productivity' AND b.slug IN ('effet-cumule','the-one-thing');

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE c.slug = 'french' AND b.book_language = 'FR';

INSERT INTO public.collection_books (collection_id, book_id, sort_order)
SELECT c.id, b.id, 0 FROM public.collections c, public.books b
WHERE c.slug = 'english' AND b.book_language = 'EN';

-- 7. Homepage sections -----------------------------------------------------
INSERT INTO public.homepage_sections (key, title_tr, title_en, title_fr, kind, collection_id, is_enabled, sort_order)
SELECT c.slug, c.title_tr, c.title_en, c.title_fr, 'collection', c.id, true, c.sort_order
FROM public.collections c;