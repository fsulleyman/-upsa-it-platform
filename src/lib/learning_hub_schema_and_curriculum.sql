-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- LEARNING HUB SCHEMA MIGRATION & IDEMPOTENT CURRICULUM SEED
-- ============================================================================
-- Copy and paste this file into the Supabase SQL Editor and click RUN.
-- It is 100% idempotent and preserves existing administrator edits.

-- ----------------------------------------------------------------------------
-- 1. EXTEND PUBLIC.COURSES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  course_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL DEFAULT '100',
  semester TEXT DEFAULT '1',
  credit_hours INT DEFAULT 3,
  course_outline_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add missing columns if extending an existing courses table
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS course_type TEXT NOT NULL DEFAULT 'required' CHECK (course_type IN ('required', 'elective'));
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS elective_group TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS programme TEXT NOT NULL DEFAULT 'BSc Information Technology Management';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 2. CREATE INDEXES ON PUBLIC.COURSES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_courses_course_code ON public.courses(course_code);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_semester ON public.courses(semester);
CREATE INDEX IF NOT EXISTS idx_courses_programme ON public.courses(programme);
CREATE INDEX IF NOT EXISTS idx_courses_course_type ON public.courses(course_type);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_display_order ON public.courses(display_order);

-- ----------------------------------------------------------------------------
-- 3. CREATE PUBLIC.LEARNING_RESOURCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('slide', 'note', 'past_question', 'assignment', 'tutorial', 'video', 'other')),
  file_path TEXT,
  file_url TEXT,
  external_url TEXT,
  thumbnail_url TEXT,
  academic_year TEXT,
  resource_year INT,
  duration TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. CREATE INDEXES ON PUBLIC.LEARNING_RESOURCES
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_learning_resources_course_id ON public.learning_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_resources_resource_type ON public.learning_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_is_published ON public.learning_resources(is_published);
CREATE INDEX IF NOT EXISTS idx_learning_resources_academic_year ON public.learning_resources(academic_year);
CREATE INDEX IF NOT EXISTS idx_learning_resources_resource_year ON public.learning_resources(resource_year);
CREATE INDEX IF NOT EXISTS idx_learning_resources_display_order ON public.learning_resources(display_order);

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies on courses
DROP POLICY IF EXISTS "Public Read Active Courses" ON public.courses;
DROP POLICY IF EXISTS "Public Read Courses" ON public.courses;
DROP POLICY IF EXISTS "Admin Write Courses" ON public.courses;

-- Courses Policies: Public Read Active, Admin Write All
CREATE POLICY "Public Read Active Courses" ON public.courses
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admin Write Courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Clean up existing policies on learning_resources
DROP POLICY IF EXISTS "Public Read Published Learning Resources" ON public.learning_resources;
DROP POLICY IF EXISTS "Admin Write Learning Resources" ON public.learning_resources;

-- Learning Resources Policies: Public Read Published, Admin Write All
CREATE POLICY "Public Read Published Learning Resources" ON public.learning_resources
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin Write Learning Resources" ON public.learning_resources
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. IDEMPOTENT CURRICULUM SEED FOR BSC INFORMATION TECHNOLOGY MANAGEMENT
-- ----------------------------------------------------------------------------
-- Uses ON CONFLICT (course_code) DO NOTHING to preserve admin modifications.

INSERT INTO public.courses (
  id, course_code, title, level, semester, credit_hours, course_type, elective_group, programme, display_order, is_active
) VALUES
-- LEVEL 100 — FIRST SEMESTER
('c-bgec101', 'BGEC101', 'Communication Skills', '100', '1', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bitm101', 'BITM101', 'Computer Graphics and Multimedia Applications', '100', '1', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bgec105', 'BGEC105', 'Logic and Critical Thinking', '100', '1', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bgec107', 'BGEC107', 'Introduction to Information Technology', '100', '1', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bgec109', 'BGEC109', 'French Language', '100', '1', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),

-- LEVEL 100 — SECOND SEMESTER
('c-bgec102', 'BGEC102', 'Scholarly Writing', '100', '2', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bitm102', 'BITM102', 'Computer Hardware Systems', '100', '2', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bitm104', 'BITM104', 'Programming Fundamentals', '100', '2', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bcpc112', 'BCPC112', 'Introduction to Business Statistics', '100', '2', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bcad108', 'BCAD108', 'Business French', '100', '2', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),

-- LEVEL 200 — FIRST SEMESTER
('c-bitm201', 'BITM201', 'Computer Networks', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bcpc201', 'BCPC201', 'Information Systems', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bcpc203', 'BCPC203', 'Introduction to Business Finance', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bitm203', 'BITM203', 'Web Development Technologies', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bcpc205', 'BCPC205', 'Elements of Marketing', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),
('c-bcpc209', 'BCPC209', 'Legal Environment of Business', '200', '1', 3, 'required', NULL, 'BSc Information Technology Management', 6, true),

-- LEVEL 200 — SECOND SEMESTER
('c-bitm202', 'BITM202', 'Operating Systems', '200', '2', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bitm204', 'BITM204', 'Database Management System I', '200', '2', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bcpc206', 'BCPC206', 'Introduction to Total Quality Management', '200', '2', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bcpc208', 'BCPC208', 'Quantitative Methods', '200', '2', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bcpc118', 'BCPC118', 'Economics for Business', '200', '2', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),

-- LEVEL 300 — FIRST SEMESTER
('c-bcpc207', 'BCPC207', 'Principles of Leadership', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bcpc301', 'BCPC301', 'Research Methods', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bitm301', 'BITM301', 'Programming', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bitm303', 'BITM303', 'Database Management Systems II', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bitm305', 'BITM305', 'Automation of Business Processes & Systems', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),
('c-bitm307', 'BITM307', 'Data Communication & Computer Networks', '300', '1', 3, 'required', NULL, 'BSc Information Technology Management', 6, true),

-- LEVEL 300 — SECOND SEMESTER
('c-bgec104', 'BGEC104', 'Introduction to Environmental Management', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bcpc202', 'BCPC202', 'Global Dimension of Business', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bcpc212', 'BCPC212', 'Business Ethics', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bitm302', 'BITM302', 'Management Information Systems', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bitm304', 'BITM304', 'Systems Analysis and Design', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),
('c-bitm306', 'BITM306', 'IT Sourcing and Procurement', '300', '2', 3, 'required', NULL, 'BSc Information Technology Management', 6, true),

-- LEVEL 400 — FIRST SEMESTER (REQUIRED & ELECTIVES)
('c-bcpc401', 'BCPC401', 'Internship', '400', '1', 3, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bcpc403', 'BCPC403', 'Business Policy and Strategy', '400', '1', 3, 'required', NULL, 'BSc Information Technology Management', 2, true),
('c-bitm401', 'BITM401', 'Network and Systems Administration', '400', '1', 3, 'required', NULL, 'BSc Information Technology Management', 3, true),
('c-bitm403', 'BITM403', 'IT Implementation and Maintenance', '400', '1', 3, 'required', NULL, 'BSc Information Technology Management', 4, true),
('c-bitm405', 'BITM405', 'Systems Audit and Control', '400', '1', 3, 'required', NULL, 'BSc Information Technology Management', 5, true),
('c-bitm407', 'BITM407', 'Management of IT Systems and Resources', '400', '1', 3, 'elective', 'LEVEL400_SEM1_ELECTIVE', 'BSc Information Technology Management', 6, true),
('c-bitm409', 'BITM409', 'Electronic Business', '400', '1', 3, 'elective', 'LEVEL400_SEM1_ELECTIVE', 'BSc Information Technology Management', 7, true),

-- LEVEL 400 — SECOND SEMESTER (REQUIRED & ELECTIVES)
('c-bcpc400', 'BCPC400', 'Project Work', '400', '2', 6, 'required', NULL, 'BSc Information Technology Management', 1, true),
('c-bitm402', 'BITM402', 'Professional Computing Practice', '400', '2', 3, 'elective', 'LEVEL400_SEM2_ELECTIVE', 'BSc Information Technology Management', 2, true),
('c-bitm404', 'BITM404', 'Information Management', '400', '2', 3, 'elective', 'LEVEL400_SEM2_ELECTIVE', 'BSc Information Technology Management', 3, true),
('c-bitm406', 'BITM406', 'Computer and Network Security', '400', '2', 3, 'elective', 'LEVEL400_SEM2_ELECTIVE', 'BSc Information Technology Management', 4, true),
('c-bitm408', 'BITM408', 'Software Quality Management', '400', '2', 3, 'elective', 'LEVEL400_SEM2_ELECTIVE', 'BSc Information Technology Management', 5, true),
('c-bitm412', 'BITM412', 'Mobile Web Development', '400', '2', 3, 'elective', 'LEVEL400_SEM2_ELECTIVE', 'BSc Information Technology Management', 6, true)
ON CONFLICT (course_code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. RELOAD POSTGREST SCHEMA CACHE
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
