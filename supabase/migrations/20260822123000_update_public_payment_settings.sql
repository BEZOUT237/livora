INSERT INTO public.settings (key, value, label, category) VALUES
  ('contact_address', 'Bolu, Türkiye', 'Public contact address', 'contact'),
  ('contact_email', 'yemelink@gmail.com', 'Public contact email', 'contact'),
  ('contact_phone', '+90 501 024 20 25', 'Public contact phone', 'contact'),
  ('bank_name', 'Ziraat Bankası', 'Bank transfer name', 'payment'),
  ('bank_iban', 'TR74 0001 0090 1078 7294 7050 01', 'Bank transfer IBAN', 'payment'),
  ('bank_account_holder', 'NIKEL BIENVENU FEUMO FOLENG', 'Bank account holder', 'payment')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  category = EXCLUDED.category,
  updated_at = now();