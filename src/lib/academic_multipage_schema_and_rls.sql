-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- MODULE 5: MULTI-PAGE ACADEMIC WEBSITE SCHEMA & RLS MIGRATION
-- ============================================================================

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL DEFAULT 'Undergraduate',
  semester TEXT DEFAULT 'Semester 1',
  credit_hours INT DEFAULT 3,
  course_outline_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Extend Faculty Table with Academic Attributes
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS qualifications TEXT[] DEFAULT '{}';
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS research_interests TEXT[] DEFAULT '{}';
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS teaching_areas TEXT[] DEFAULT '{}';
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS google_scholar_url TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS orcid_url TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS profile_slug TEXT UNIQUE;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 3. Faculty ↔ Courses Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS faculty_courses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  faculty_id TEXT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(faculty_id, course_id)
);

-- 4. Course ↔ Programmes Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS course_programmes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  programme_id TEXT NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, programme_id)
);

-- 5. Research Projects Table
CREATE TABLE IF NOT EXISTS research_projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  description TEXT,
  lead_faculty_id TEXT REFERENCES faculty(id) ON DELETE SET NULL,
  research_area TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  start_date TEXT,
  end_date TEXT,
  image_url TEXT,
  external_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Faculty Publications Table
CREATE TABLE IF NOT EXISTS faculty_publications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  faculty_id TEXT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  publication_type TEXT DEFAULT 'Journal Article',
  journal_or_venue TEXT NOT NULL,
  publication_year INT NOT NULL,
  authors TEXT[] DEFAULT '{}',
  url TEXT,
  doi TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Courses
INSERT INTO courses (id, course_code, title, description, level, semester, credit_hours, display_order, is_active) VALUES
('c-prog-101', 'BITM 101', 'Programming Fundamentals & Object-Oriented Design', 'Introduction to computational thinking, algorithms, object-oriented concepts in Java and Python.', 'Undergraduate', 'Semester 1', 3, 1, true),
('c-db-201', 'BITM 201', 'Database Management Systems & SQL Architecture', 'Relational database modeling, SQL querying, transaction safety, and database administration.', 'Undergraduate', 'Semester 2', 3, 2, true),
('c-net-202', 'BITM 202', 'Enterprise Computer Networks & Cybersecurity', 'Data communications, OSI & TCP/IP stack, router configuration, firewall policies, and security.', 'Undergraduate', 'Semester 2', 3, 3, true),
('c-ai-301', 'BDSA 301', 'Applied Machine Learning & Pattern Recognition', 'Supervised and unsupervised learning, decision trees, neural networks, and model evaluation.', 'Undergraduate', 'Semester 1', 3, 4, true),
('c-sec-501', 'MIS 501', 'Enterprise Information Security Management', 'Postgraduate principles of information risk assessment, compliance frameworks, and incident response.', 'Postgraduate', 'Semester 1', 3, 5, true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_publications ENABLE ROW LEVEL SECURITY;

-- Clean Up Old Policies if any
DROP POLICY IF EXISTS "Public Read Courses" ON courses;
DROP POLICY IF EXISTS "Public Read Faculty Courses" ON faculty_courses;
DROP POLICY IF EXISTS "Public Read Course Programmes" ON course_programmes;
DROP POLICY IF EXISTS "Public Read Research Projects" ON research_projects;
DROP POLICY IF EXISTS "Public Read Faculty Publications" ON faculty_publications;

DROP POLICY IF EXISTS "Admin Write Courses" ON courses;
DROP POLICY IF EXISTS "Admin Write Faculty Courses" ON faculty_courses;
DROP POLICY IF EXISTS "Admin Write Course Programmes" ON course_programmes;
DROP POLICY IF EXISTS "Admin Write Research Projects" ON research_projects;
DROP POLICY IF EXISTS "Admin Write Faculty Publications" ON faculty_publications;

-- Public READ Policies
CREATE POLICY "Public Read Courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public Read Faculty Courses" ON faculty_courses FOR SELECT USING (true);
CREATE POLICY "Public Read Course Programmes" ON course_programmes FOR SELECT USING (true);
CREATE POLICY "Public Read Research Projects" ON research_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Faculty Publications" ON faculty_publications FOR SELECT USING (true);

-- Admin WRITE Policies
CREATE POLICY "Admin Write Courses" ON courses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Faculty Courses" ON faculty_courses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Course Programmes" ON course_programmes FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Research Projects" ON research_projects FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Faculty Publications" ON faculty_publications FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
