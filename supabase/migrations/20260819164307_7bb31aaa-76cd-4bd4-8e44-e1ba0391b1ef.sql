DROP POLICY IF EXISTS "public read public settings" ON public.settings;
CREATE POLICY "public read public settings" ON public.settings
  FOR SELECT TO anon, authenticated
  USING (category IN ('contact', 'payment', 'commerce'));

GRANT SELECT ON public.settings TO anon;