-- Supabase SQL Migration: Add is_featured column to faculty table
-- Goal: Allow filtering Homepage Faculty Section (3 members) vs Dedicated Faculty Page (#/faculty) (all members)

ALTER TABLE public.faculty
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Set is_featured = TRUE for the three key leadership members
UPDATE public.faculty
SET is_featured = TRUE
WHERE name ILIKE '%Koi-Akrofi%'
   OR name ILIKE '%Agor%'
   OR name ILIKE '%Ofoeda%'
   OR id IN ('prof-koi-akrofi', 'dr-augustina-dede-agor', 'dr-joshua-kwaku-ofoeda', 'dean-koi-akrofi', 'dr-augustina-agor', 'dr-joshua-ofoeda');

-- Confirm migration status
SELECT id, name, title, is_active, is_featured
FROM public.faculty
ORDER BY display_order ASC, name ASC;
