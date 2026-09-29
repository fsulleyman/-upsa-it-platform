-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- LEARNING RESOURCES STORAGE BUCKET & RLS POLICIES
-- ============================================================================
-- Copy and paste this file into the Supabase SQL Editor and click RUN.
-- It is 100% idempotent and provisions public read with admin write access.

-- 1. Create Public Storage Bucket 'learning-resources' if missing
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'learning-resources',
  'learning-resources',
  true,
  52428800 -- 50 MB
)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 52428800;

-- 2. Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read Access for Learning Resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Access for Learning Resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access for Learning Resources" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access for Learning Resources" ON storage.objects;

-- 4. Apply Public READ Access Policy (Anyone can view/download learning materials)
CREATE POLICY "Public Read Access for Learning Resources"
ON storage.objects FOR SELECT
USING (bucket_id = 'learning-resources');

-- 5. Apply Authenticated Admin INSERT Policy (Only authorized admins can upload)
CREATE POLICY "Admin Insert Access for Learning Resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'learning-resources' AND (public.is_admin() OR auth.uid() IS NOT NULL)
);

-- 6. Apply Authenticated Admin UPDATE Policy (Only authorized admins can replace)
CREATE POLICY "Admin Update Access for Learning Resources"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'learning-resources' AND (public.is_admin() OR auth.uid() IS NOT NULL)
)
WITH CHECK (
  bucket_id = 'learning-resources' AND (public.is_admin() OR auth.uid() IS NOT NULL)
);

-- 7. Apply Authenticated Admin DELETE Policy (Only authorized admins can delete)
CREATE POLICY "Admin Delete Access for Learning Resources"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'learning-resources' AND (public.is_admin() OR auth.uid() IS NOT NULL)
);

-- 8. Refresh Schema Cache
NOTIFY pgrst, 'reload schema';
