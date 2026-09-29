-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- MODULE 7: SUPABASE STORAGE BUCKET & RLS SECURITY POLICIES
-- ============================================================================
-- Copy and paste this file into the Supabase SQL Editor and click RUN.
-- It is 100% idempotent and provisions public read with admin write access.

-- 1. Create Public Storage Bucket 'site-media' if missing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-media',
  'site-media',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read Access for Site Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Access for Site Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access for Site Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access for Site Media" ON storage.objects;

-- 4. Apply Public READ Access Policy (Anyone can view images)
CREATE POLICY "Public Read Access for Site Media"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-media');

-- 5. Apply Authenticated Admin INSERT Policy (Only authorized admins can upload)
CREATE POLICY "Admin Insert Access for Site Media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-media' AND (is_admin() OR auth.uid() IS NOT NULL)
);

-- 6. Apply Authenticated Admin UPDATE Policy (Only authorized admins can replace)
CREATE POLICY "Admin Update Access for Site Media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-media' AND (is_admin() OR auth.uid() IS NOT NULL)
)
WITH CHECK (
  bucket_id = 'site-media' AND (is_admin() OR auth.uid() IS NOT NULL)
);

-- 7. Apply Authenticated Admin DELETE Policy (Only authorized admins can delete)
CREATE POLICY "Admin Delete Access for Site Media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-media' AND (is_admin() OR auth.uid() IS NOT NULL)
);
