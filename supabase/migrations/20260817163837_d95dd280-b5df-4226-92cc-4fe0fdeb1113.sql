CREATE POLICY "staff read covers" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'covers' AND public.is_staff(auth.uid()));
CREATE POLICY "staff upload covers" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers' AND public.is_staff(auth.uid()));
CREATE POLICY "staff update covers" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'covers' AND public.is_staff(auth.uid()));
CREATE POLICY "staff delete covers" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'covers' AND public.is_staff(auth.uid()));