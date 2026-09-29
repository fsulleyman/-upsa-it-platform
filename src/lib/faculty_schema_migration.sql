-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- FACULTY TABLE SCHEMA EXTENSION MIGRATION
-- Safe & idempotent: Adds missing extended profile columns to public.faculty
-- ============================================================================
-- Copy and paste this file into the Supabase SQL Editor and click RUN.

ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS office_hours TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS qualifications TEXT[] DEFAULT '{}';
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS teaching_areas TEXT[] DEFAULT '{}';
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS research_interests TEXT[] DEFAULT '{}';
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS google_scholar_url TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS orcid_url TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE public.faculty ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Force PostgREST to reload schema cache so new columns are immediately recognized
NOTIFY pgrst, 'reload schema';
