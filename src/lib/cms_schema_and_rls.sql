-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- MODULE 4: CMS SCHEMA & RLS SECURITY MIGRATION
-- ============================================================================

-- 1. Site Settings & SEO Configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  site_title TEXT NOT NULL DEFAULT 'UPSA Department of Information Technology Studies',
  meta_description TEXT DEFAULT 'Official web portal for the Department of IT Studies at UPSA, Accra, Ghana.',
  organization_name TEXT DEFAULT 'Department of Information Technology Studies',
  canonical_url TEXT DEFAULT 'https://upsa.edu.gh',
  share_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hero & Homepage Banner Configuration
CREATE TABLE IF NOT EXISTS hero_section (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  top_line TEXT DEFAULT 'UPSA ACCRA • FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES • EST. 1965',
  headline TEXT NOT NULL DEFAULT 'Department of Information Technology Studies',
  subtext TEXT DEFAULT 'University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.',
  primary_cta_text TEXT DEFAULT 'Explore Academic Programmes',
  primary_cta_link TEXT DEFAULT 'academics',
  secondary_cta_text TEXT DEFAULT 'Inspect Student Systems & Code',
  secondary_cta_link TEXT DEFAULT 'innovation',
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Navigation Items Configuration
CREATE TABLE IF NOT EXISTS nav_items (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  label TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Footer Content & Branding Configuration
CREATE TABLE IF NOT EXISTS footer_content (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  logo_text TEXT DEFAULT 'UPSA • IT STUDIES',
  motto_text TEXT DEFAULT 'Scholarship with Professionalism',
  description TEXT DEFAULT 'The Department of Information Technology Studies sits inside the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra.',
  digital_address TEXT DEFAULT 'GA-193-4704',
  address TEXT DEFAULT 'P.O. Box LG 149, Accra – Ghana',
  phone_admissions TEXT DEFAULT '+233 30 250 0311',
  phone_switchboard TEXT DEFAULT '+233 30 250 0312',
  email TEXT DEFAULT 'infotech@upsamail.edu.gh',
  copyright_text TEXT DEFAULT 'Department of Information Technology Studies — Faculty of Information Technology and Communication Studies, UPSA.',
  portal_url TEXT DEFAULT 'https://upsa.edu.gh',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Footer Quick Links Configuration
CREATE TABLE IF NOT EXISTS footer_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  column_title TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  is_external BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Social Links Configuration
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Globe',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Data if missing
INSERT INTO site_settings (id, site_title, meta_description, organization_name, canonical_url)
VALUES ('primary', 'UPSA Department of Information Technology Studies', 'Official web portal for the Department of IT Studies at UPSA, Accra, Ghana.', 'Department of Information Technology Studies', 'https://upsa.edu.gh')
ON CONFLICT (id) DO NOTHING;

INSERT INTO hero_section (id, top_line, headline, subtext, primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link)
VALUES ('primary', 'UPSA ACCRA • FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES • EST. 1965', 'Department of Information Technology Studies', 'University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.', 'Explore Academic Programmes', 'academics', 'Inspect Student Systems & Code', 'innovation')
ON CONFLICT (id) DO NOTHING;

INSERT INTO footer_content (id, logo_text, motto_text, description, digital_address, address, phone_admissions, phone_switchboard, email, copyright_text, portal_url)
VALUES ('primary', 'UPSA • IT STUDIES', 'Scholarship with Professionalism', 'The Department of Information Technology Studies sits inside the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra.', 'GA-193-4704', 'P.O. Box LG 149, Accra – Ghana', '+233 30 250 0311', '+233 30 250 0312', 'infotech@upsamail.edu.gh', 'Department of Information Technology Studies — Faculty of Information Technology and Communication Studies, UPSA.', 'https://upsa.edu.gh')
ON CONFLICT (id) DO NOTHING;

-- Seed Navigation
INSERT INTO nav_items (id, section_id, label, display_order, is_active) VALUES
('nav-home', 'home', 'HOME', 1, true),
('nav-about', 'about', 'ABOUT', 2, true),
('nav-academics', 'academics', 'ACADEMICS', 3, true),
('nav-hub', 'hub', 'DEVELOPERS HUB', 4, true),
('nav-innovation', 'innovation', 'INNOVATION', 5, true),
('nav-community', 'community', 'COMMUNITY', 6, true),
('nav-contact', 'contact', 'CONTACT', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Footer Links
INSERT INTO footer_links (id, column_title, label, url, is_external, display_order, is_active) VALUES
('fl-1', 'ACADEMICS & HUB', 'Academic Programmes', 'academics', false, 1, true),
('fl-2', 'ACADEMICS & HUB', 'UPSA Developers Hub', 'hub', false, 2, true),
('fl-3', 'ACADEMICS & HUB', 'Student Innovations & Showcase', 'innovation', false, 3, true),
('fl-4', 'ACADEMICS & HUB', 'DataCamp Classroom Integration', 'community', false, 4, true),
('fl-5', 'ADMISSIONS & FACULTY', 'About FITCS Faculty', 'about', false, 1, true),
('fl-6', 'ADMISSIONS & FACULTY', 'Faculty Secretariat Contact', 'contact', false, 2, true),
('fl-7', 'ADMISSIONS & FACULTY', 'Official UPSA Website', 'https://upsa.edu.gh', true, 3, true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Clean Up Old Policies if any
DROP POLICY IF EXISTS "Public Read Site Settings" ON site_settings;
DROP POLICY IF EXISTS "Public Read Hero Section" ON hero_section;
DROP POLICY IF EXISTS "Public Read Nav Items" ON nav_items;
DROP POLICY IF EXISTS "Public Read Footer Content" ON footer_content;
DROP POLICY IF EXISTS "Public Read Footer Links" ON footer_links;
DROP POLICY IF EXISTS "Public Read Social Links" ON social_links;

DROP POLICY IF EXISTS "Admin Write Site Settings" ON site_settings;
DROP POLICY IF EXISTS "Admin Write Hero Section" ON hero_section;
DROP POLICY IF EXISTS "Admin Write Nav Items" ON nav_items;
DROP POLICY IF EXISTS "Admin Write Footer Content" ON footer_content;
DROP POLICY IF EXISTS "Admin Write Footer Links" ON footer_links;
DROP POLICY IF EXISTS "Admin Write Social Links" ON social_links;

-- Public READ Policies
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Hero Section" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public Read Nav Items" ON nav_items FOR SELECT USING (true);
CREATE POLICY "Public Read Footer Content" ON footer_content FOR SELECT USING (true);
CREATE POLICY "Public Read Footer Links" ON footer_links FOR SELECT USING (true);
CREATE POLICY "Public Read Social Links" ON social_links FOR SELECT USING (true);

-- Admin WRITE Policies (Strict is_admin Check)
CREATE POLICY "Admin Write Site Settings" ON site_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Hero Section" ON hero_section FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Nav Items" ON nav_items FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Footer Content" ON footer_content FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Footer Links" ON footer_links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin Write Social Links" ON social_links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
