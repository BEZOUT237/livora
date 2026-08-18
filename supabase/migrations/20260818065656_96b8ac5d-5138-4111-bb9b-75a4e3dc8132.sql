DROP POLICY IF EXISTS "anyone can upload payment proofs" ON storage.objects;
CREATE POLICY "anyone can upload payment proofs" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

DROP POLICY IF EXISTS "staff read payment proofs" ON storage.objects;
CREATE POLICY "staff read payment proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff delete payment proofs" ON storage.objects;
CREATE POLICY "staff delete payment proofs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'payment-proofs' AND public.is_staff(auth.uid()));