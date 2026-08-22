CREATE POLICY "public read storefront content" ON public.settings
FOR SELECT TO anon, authenticated
USING (key IN (
  'contact_email', 'contact_phone', 'contact_address', 'footer_about',
  'home_hero_title', 'home_hero_subtitle', 'home_hero_eyebrow',
  'about_intro', 'brand_name', 'brand_tagline'
));