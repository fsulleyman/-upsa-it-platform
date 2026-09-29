-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- MODULE 7: EVENT ANNOUNCEMENT POPUP SCHEMA & RLS MIGRATION
-- ============================================================================
-- Copy and paste this file into the Supabase SQL Editor and click RUN.
-- Safe & idempotent: provisions event_announcements table and RLS policies.

CREATE TABLE IF NOT EXISTS event_announcements (
  id TEXT PRIMARY KEY DEFAULT 'isap-forum-2026',
  title TEXT NOT NULL DEFAULT 'ISAP Forum 2026',
  description TEXT DEFAULT 'Theme: Public Sector Identification Systems for Socioeconomic Development: Ghana’s Experience and the Way Forward. Hosted by the Faculty of IT and Communication Studies.',
  event_date TEXT DEFAULT 'Wednesday, 7th October 2026',
  event_time TEXT DEFAULT '9:00 AM GMT',
  venue TEXT DEFAULT 'PCU Auditorium (Second Floor), UPSA',
  image_url TEXT DEFAULT '/images/isap_forum_2026.jpg',
  registration_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial ISAP Forum 2026 Data if missing
INSERT INTO event_announcements (
  id,
  title,
  description,
  event_date,
  event_time,
  venue,
  image_url,
  registration_url,
  is_active,
  display_order
) VALUES (
  'isap-forum-2026',
  'ISAP Forum 2026',
  'Theme: Public Sector Identification Systems for Socioeconomic Development: Ghana’s Experience and the Way Forward. Hosted by the Faculty of IT and Communication Studies.',
  'Wednesday, 7th October 2026',
  '9:00 AM GMT',
  'PCU Auditorium (Second Floor), UPSA',
  '/images/isap_forum_2026.jpg',
  '',
  true,
  1
) ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE event_announcements ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies to avoid duplication
DROP POLICY IF EXISTS "Public Read Event Announcements" ON event_announcements;
DROP POLICY IF EXISTS "Admin Insert Event Announcements" ON event_announcements;
DROP POLICY IF EXISTS "Admin Update Event Announcements" ON event_announcements;
DROP POLICY IF EXISTS "Admin Delete Event Announcements" ON event_announcements;

-- Public READ Policy (Anyone can read active event announcements)
CREATE POLICY "Public Read Event Announcements"
ON event_announcements FOR SELECT
USING (true);

-- Admin WRITE Policies (Only authorized admins can insert, update, delete)
CREATE POLICY "Admin Insert Event Announcements"
ON event_announcements FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admin Update Event Announcements"
ON event_announcements FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admin Delete Event Announcements"
ON event_announcements FOR DELETE
TO authenticated
USING (is_admin());

-- Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
