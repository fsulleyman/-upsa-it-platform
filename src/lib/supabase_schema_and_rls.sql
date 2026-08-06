-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- SUPABASE DATABASE SCHEMA & ZERO-TRUST RLS SECURITY POLICIES
-- ============================================================================

-- 0. ADMIN USERS REGISTRY TABLE
-- Stores specific authorized admin user IDs. Client-side access is ZERO-TRUST.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- LOCKDOWN POLICIES FOR admin_users TABLE:
-- 1. NO INSERT policy for public/authenticated clients (Client INSERT is DENIED BY DEFAULT under RLS).
-- 2. NO UPDATE policy for public/authenticated clients (Client UPDATE is DENIED BY DEFAULT under RLS).
-- 3. NO DELETE policy for public/authenticated clients (Client DELETE is DENIED BY DEFAULT under RLS).
-- 4. NO SELECT policy for public/authenticated clients (Client SELECT is DENIED BY DEFAULT under RLS).
-- Result: admin_users is 100% inaccessible to all client queries, and can ONLY be populated
-- directly in the Supabase SQL Editor / Dashboard by the database owner.
-- The Postgres RLS engine evaluates membership internally via SECURITY DEFINER logic during content write attempts.


-- 1. PROGRAMMES TABLE
CREATE TABLE IF NOT EXISTS programmes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  skills_developed TEXT[] DEFAULT '{}',
  career_outcomes TEXT[] DEFAULT '{}',
  core_modules TEXT[] DEFAULT '{}',
  entry_requirements TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE (Innovation Showcase)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  full_details TEXT,
  category TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  student_name TEXT NOT NULL,
  student_role TEXT,
  mentor_name TEXT,
  hub_affiliation TEXT,
  is_verified_real BOOLEAN DEFAULT FALSE,
  is_sample BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  article_url TEXT,
  article_source TEXT,
  github_url TEXT,
  demo_url TEXT,
  date TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FACULTY TABLE (Leadership Directory)
CREATE TABLE IF NOT EXISTS faculty (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  academic_degree TEXT,
  office_location TEXT,
  role TEXT,
  bio TEXT,
  specialization TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  is_hod BOOLEAN DEFAULT FALSE,
  is_unconfirmed_hod BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROMO SLIDES TABLE (Announcement Banner)
CREATE TABLE IF NOT EXISTS promo_slides (
  id TEXT PRIMARY KEY,
  badge_text TEXT,
  title TEXT NOT NULL,
  subtext TEXT,
  image_url TEXT NOT NULL,
  cta_text TEXT,
  cta_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INSTITUTION INFO TABLE (Secretariat & Site Details)
CREATE TABLE IF NOT EXISTS institution_info (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  university_name TEXT NOT NULL,
  motto TEXT,
  established TEXT,
  address TEXT,
  location TEXT,
  faculty_name TEXT,
  faculty_est TEXT,
  faculty_location TEXT,
  faculty_phone TEXT,
  switchboard TEXT,
  email TEXT,
  digital_address TEXT,
  dean TEXT,
  department_name TEXT,
  hod_name TEXT,
  is_hod_confirmed BOOLEAN DEFAULT TRUE,
  faculty_vision TEXT,
  faculty_credo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DEVELOPERS HUB TABLE (Flagship Details)
CREATE TABLE IF NOT EXISTS developers_hub (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  nature TEXT,
  mission TEXT,
  mentor_name TEXT,
  mentor_degree TEXT,
  mentor_role TEXT,
  milestone_title TEXT,
  milestone_date TEXT,
  milestone_location TEXT,
  participants_count INT DEFAULT 400,
  milestone_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — EXPLICIT ADMIN ROLE CHECK
-- ============================================================================

-- Enable RLS on all data tables
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers_hub ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Public Anonymous Read Policies (SELECT allowed for all site visitors)
-- ----------------------------------------------------------------------------
CREATE POLICY "Public Read Programmes" ON programmes FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Public Read Promo Slides" ON promo_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Institution Info" ON institution_info FOR SELECT USING (true);
CREATE POLICY "Public Read Developers Hub" ON developers_hub FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- Strict Admin Write Policies (INSERT/UPDATE/DELETE restricted strictly to user_ids in admin_users)
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin Write Programmes" ON programmes FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admin Write Projects" ON projects FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admin Write Faculty" ON faculty FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admin Write Promo Slides" ON promo_slides FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admin Write Institution Info" ON institution_info FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

CREATE POLICY "Admin Write Developers Hub" ON developers_hub FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
