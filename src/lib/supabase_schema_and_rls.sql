-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- SUPABASE COMPLETE IDEMPOTENT SCHEMA MIGRATION & RLS SECURITY POLICIES
-- ============================================================================
-- Copy and paste this ENTIRE file into the Supabase SQL Editor and click RUN.
-- It is 100% idempotent: safe to run on new or existing databases.

-- ----------------------------------------------------------------------------
-- PART 1: CREATE ALL TABLES FIRST
-- ----------------------------------------------------------------------------

-- 1. Admin Users Registry Table (Zero-Trust Client Access)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Academic Qualifications & Programmes Table
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

-- 3. Innovation Showcase Student Projects Table
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

-- 4. Faculty & Leadership Directory Table
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

-- 5. Promotional Announcement Banners Table
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

-- 6. Secretariat & Institution Info Table
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

-- 7. Developers Hub Details & Milestones Table
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


-- ----------------------------------------------------------------------------
-- PART 2: ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- ----------------------------------------------------------------------------
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE developers_hub ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- PART 3: CLEANUP EXISTING POLICIES FOR IDEMPOTENT RUNS
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Programmes" ON programmes;
DROP POLICY IF EXISTS "Public Read Projects" ON projects;
DROP POLICY IF EXISTS "Public Read Faculty" ON faculty;
DROP POLICY IF EXISTS "Public Read Promo Slides" ON promo_slides;
DROP POLICY IF EXISTS "Public Read Institution Info" ON institution_info;
DROP POLICY IF EXISTS "Public Read Developers Hub" ON developers_hub;

DROP POLICY IF EXISTS "Admin Write Programmes" ON programmes;
DROP POLICY IF EXISTS "Admin Write Projects" ON projects;
DROP POLICY IF EXISTS "Admin Write Faculty" ON faculty;
DROP POLICY IF EXISTS "Admin Write Promo Slides" ON promo_slides;
DROP POLICY IF EXISTS "Admin Write Institution Info" ON institution_info;
DROP POLICY IF EXISTS "Admin Write Developers Hub" ON developers_hub;


-- ----------------------------------------------------------------------------
-- PART 4: APPLY PUBLIC READ POLICIES (SELECT Allowed for All Visitors)
-- ----------------------------------------------------------------------------
CREATE POLICY "Public Read Programmes" ON programmes FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Faculty" ON faculty FOR SELECT USING (true);
CREATE POLICY "Public Read Promo Slides" ON promo_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Institution Info" ON institution_info FOR SELECT USING (true);
CREATE POLICY "Public Read Developers Hub" ON developers_hub FOR SELECT USING (true);


-- ----------------------------------------------------------------------------
-- PART 5: APPLY ADMIN WRITE POLICIES (INSERT/UPDATE/DELETE Restricted to admin_users)
-- ----------------------------------------------------------------------------
-- Note: admin_users table itself has NO client policies (denied by default).
-- Writes to content tables are strictly authorized only if the user's UUID is in admin_users.

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
