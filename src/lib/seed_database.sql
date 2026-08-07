-- ============================================================================
-- UPSA DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES
-- PRODUCTION DATABASE SEED & TEST DATA CLEANUP SCRIPT
-- ============================================================================
-- Copy and paste this ENTIRE file into the Supabase SQL Editor and click RUN.

-- 0. CLEAN UP TEST DATA
DELETE FROM programmes WHERE code = 'DM123' OR id = 'digital-marketing' OR name ILIKE '%digital marketing%';

-- 1. SEED ACADEMIC PROGRAMMES (5 Records)
INSERT INTO programmes (id, code, name, level, duration, tagline, description, skills_developed, career_outcomes, core_modules, entry_requirements, is_new, image_url)
VALUES
(
  'bsc-it-mgt',
  'BSc ITM',
  'BSc Information Technology Management',
  'Undergraduate',
  '4 Years',
  'Bridging business strategy with enterprise IT execution.',
  'Equips students with solid foundations in software development, database administration, network engineering, and corporate IT governance.',
  ARRAY['Enterprise Architecture', 'Software Engineering', 'Database Systems', 'IT Project Management', 'Network Administration'],
  ARRAY['IT Systems Analyst', 'Database Administrator', 'Enterprise Solutions Architect', 'Network Engineer', 'IT Project Manager'],
  ARRAY['Programming Fundamentals & OOP', 'Database Management Systems', 'Network Infrastructure & Security', 'Systems Analysis & Agile Design', 'Enterprise Resource Planning (ERP)', 'IT Governance & Ethics'],
  ARRAY['WASSCE: Credit passes (A1-C6) in Core English, Core Math, Integrated Science/Social Studies, plus 3 Electives', 'SSSCE: Credit passes (A-D) in Core & Elective subjects', 'HND or Diploma in IT/Computer Science for Top-Up admission'],
  false,
  '/images/prog_bsc_it.png'
),
(
  'bsc-ds-analytics',
  'BSc DSA',
  'BSc Data Science and Analytics',
  'Undergraduate',
  '4 Years',
  'Unlocking actionable business intelligence from complex data.',
  'Prepares data-driven leaders in machine learning, big data architectures, statistical modeling, and real-time analytical decision systems.',
  ARRAY['Machine Learning', 'Python/R Analytics', 'SQL & Big Data', 'Data Visualization', 'Statistical Inference'],
  ARRAY['Data Scientist', 'Business Intelligence Engineer', 'Data Analyst', 'Machine Learning Specialist', 'Quantitative Risk Analyst'],
  ARRAY['Applied Data Structures & Algorithms', 'Statistical Computing & Probability', 'Machine Learning & Pattern Recognition', 'Big Data Processing & Warehousing', 'Data Mining & Visualization', 'AI Ethics & Data Privacy'],
  ARRAY['WASSCE/SSSCE with strong background in Elective Mathematics', 'Diploma in Data Science, Computer Science, or Statistics'],
  false,
  '/images/prog_bsc_ds.png'
),
(
  'dip-it-mgt',
  'Dip ITM',
  'Diploma in Information Technology Management',
  'Diploma',
  '2 Years',
  'Fast-track technical training for hands-on IT professionals.',
  'Practical 2-year diploma focused on practical hardware maintenance, basic web development, network administration, and IT support services.',
  ARRAY['Hardware & Systems Support', 'Web Technologies', 'Network Fundamentals', 'Client Support Management'],
  ARRAY['IT Support Specialist', 'Network Administrator', 'Junior Web Developer', 'Helpdesk Technical Lead'],
  ARRAY['Computer Hardware & System Software', 'Web Technologies & HTML/CSS/JS', 'Computer Networking Essentials', 'Database Applications', 'IT Customer Support & Helpdesk'],
  ARRAY['WASSCE: Passes (A1-D7) in 3 Core subjects and 3 Elective subjects', 'Mature Candidates (25+ years with relevant work experience)'],
  false,
  '/images/prog_dip_it.png'
),
(
  'msc-info-sec',
  'MSc ISM',
  'MSc Information Security Management',
  'Postgraduate',
  '1 Year',
  'Advanced cybersecurity leadership for digital asset protection.',
  'Designed for professionals seeking advanced mastery in threat intelligence, ISO 27001 compliance, penetration testing, and strategic cybersecurity governance.',
  ARRAY['Cyber Security Governance', 'Risk Assessment & Mitigation', 'Digital Forensics', 'Ethical Hacking', 'Cloud & Network Defense'],
  ARRAY['Chief Information Security Officer (CISO)', 'Cybersecurity Manager', 'Security Auditor', 'Incident Response Team Lead'],
  ARRAY['Cyber Crime & Information Warfare', 'Information Security Governance & Compliance', 'Advanced Penetration Testing & Ethical Hacking', 'Digital Forensics & Incident Response', 'Cloud Security & Infrastructure Resilience'],
  ARRAY['First Degree (Good Second Class or better) in IT, Computer Science, Engineering, or related field from a recognized university', 'Relevant professional work experience in IT or Information Security is an advantage'],
  true,
  '/images/prog_msc_sec.png'
),
(
  'mba-mis',
  'MBA MIS',
  'MBA in Management Information Systems',
  'Postgraduate',
  '2 Years',
  'Transforming technology insights into corporate executive strategy.',
  'Integrates executive business management with cutting-edge information technology strategy, digital transformation, and IT management decision systems.',
  ARRAY['Digital Transformation', 'Strategic IT Alignment', 'CIO Executive Management', 'Business Process Re-engineering'],
  ARRAY['Chief Information Officer (CIO)', 'IT Director', 'Digital Transformation Manager', 'Senior Technology Consultant'],
  ARRAY['Strategic Management Information Systems', 'Corporate Finance & Executive Leadership', 'Digital Business & E-Commerce Strategy', 'Managing Complex IT Projects', 'Data Analytics for Business Decision Making'],
  ARRAY['Recognized Bachelor''s degree in any discipline', 'Minimum 2 years post-qualification managerial/professional experience'],
  true,
  '/images/prog_mba_mis.png'
),
(
  'bsc-ai',
  'BSc AI',
  'BSc Artificial Intelligence',
  'Undergraduate',
  '4 Years',
  'Empowering intelligent autonomous systems and neural networks.',
  'Cutting-edge programme focusing on computer vision, natural language processing, deep learning architectures, and ethical AI development.',
  ARRAY['Deep Learning', 'Neural Networks', 'Python & PyTorch', 'Computer Vision', 'NLP'],
  ARRAY['AI Engineer', 'Machine Learning Scientist', 'Robotics Specialist', 'NLP Researcher'],
  ARRAY['Neural Networks & Deep Learning', 'Natural Language Processing', 'Computer Vision & Robotics', 'Ethics in Artificial Intelligence'],
  ARRAY['WASSCE/SSSCE with strong background in Mathematics', 'Diploma in Computer Science or IT'],
  true,
  '/images/prog_bsc_ds.png'
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  level = EXCLUDED.level,
  duration = EXCLUDED.duration,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  skills_developed = EXCLUDED.skills_developed,
  career_outcomes = EXCLUDED.career_outcomes,
  core_modules = EXCLUDED.core_modules,
  entry_requirements = EXCLUDED.entry_requirements,
  is_new = EXCLUDED.is_new,
  image_url = EXCLUDED.image_url;

-- 2. SEED STUDENT PROJECTS (3 Records)
INSERT INTO projects (id, title, subtitle, description, full_details, category, technologies, student_name, student_role, mentor_name, hub_affiliation, is_verified_real, is_sample, image_url, article_url, article_source, github_url, demo_url, date, featured)
VALUES
(
  'bloodvault',
  'BloodVault',
  'Web-Based Blood-Bank Management & Allocation System',
  'An intelligent digital platform connecting blood donors, hospitals, and blood banks to ensure real-time inventory tracking and urgent emergency matching.',
  'BloodVault was designed and engineered by Baffour Akoto Aninfeng under the UPSA Developers Hub. The platform digitizes blood donation records, automates blood type compatibility matching, provides live inventory dashboards for hospital blood banks, and sends automated SMS alerts to eligible donors during critical shortages.',
  'Web Development',
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
  'Baffour Akoto Aninfeng',
  'Lead Developer (Student)',
  'Dr. Augustina Dede Agor',
  'UPSA Developers Hub',
  true,
  false,
  '/images/bloodvault_preview.jpg',
  'https://www.graphic.com.gh/news/education/upsa-developers-hub-students-build-innovative-tech-solutions.html',
  'Graphic Online / UPSA Press',
  'https://github.com/upsaccra',
  '#',
  'March 2026',
  true
),
(
  'upsa-hms-prototype',
  'Hospital Management System (HMS)',
  'Digital Patient Records & Clinical Triage System',
  'A software engineering platform prototyped by UPSA Developers Hub students following observational field visits to healthcare institutions, presented at ICBMED.',
  'Engineered under the UPSA Developers Hub, this Hospital Management System (HMS) prototype digitizes patient intake, automates clinical triage, streamlines appointment scheduling, and manages ward bed allocation. The project was built following observational visits to local healthcare facilities to study real-world medical workflows and was presented at the International Conference on Business, Management, Economics and Development (ICBMED).',
  'Information Systems',
  ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Tailwind CSS', 'Systems Design'],
  'UPSA Developers Hub HealthTech Cohort',
  'Student Engineering Team',
  'Dr. Augustina Dede Agor',
  'UPSA Developers Hub & ICBMED Conference',
  true,
  false,
  '/images/hms_preview.jpg',
  'https://www.modernghana.com/news/upsa-developers-hub-presents-healthtech-projects-at-icbmed.html',
  'ModernGhana / ICBMED',
  'https://github.com/upsaccra',
  '#',
  '2026',
  true
),
(
  'sample-hub-showcase',
  'Sample Innovation Card: Submit Yours',
  'Department Student Project Showcase Placeholder',
  'Have you built an innovative software application, AI model, or cybersecurity tool? The Developers Hub wants to feature your work on the official showcase.',
  'This is a demonstration showcase card. All student projects featured on this platform undergo review by department mentors. Submit your project repository link, documentation, and live demo URL through the Developers Hub submission portal.',
  'Information Systems',
  ARRAY['Developer Hub', 'Open Source', 'Student Portfolio'],
  'UPSA Developer Student',
  'Hub Community Contributor',
  'Department Review Panel',
  'UPSA Developers Hub',
  false,
  true,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'Upcoming',
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  full_details = EXCLUDED.full_details,
  category = EXCLUDED.category,
  technologies = EXCLUDED.technologies,
  student_name = EXCLUDED.student_name,
  student_role = EXCLUDED.student_role,
  mentor_name = EXCLUDED.mentor_name,
  hub_affiliation = EXCLUDED.hub_affiliation,
  is_verified_real = EXCLUDED.is_verified_real,
  is_sample = EXCLUDED.is_sample,
  image_url = EXCLUDED.image_url,
  article_url = EXCLUDED.article_url,
  article_source = EXCLUDED.article_source,
  github_url = EXCLUDED.github_url,
  demo_url = EXCLUDED.demo_url,
  date = EXCLUDED.date,
  featured = EXCLUDED.featured;

-- 3. SEED FACULTY DIRECTORY (3 Records)
INSERT INTO faculty (id, name, title, academic_degree, office_location, role, bio, specialization, avatar_url, is_hod, is_unconfirmed_hod)
VALUES
(
  'dean-koi-akrofi',
  'Prof. Godfred Yaw Koi-Akrofi',
  'Dean, Faculty of Information Technology and Communication Studies (FITCS)',
  'PhD, Associate Professor',
  'FITCS Secretariat, Room 310/311, Justice Aryeetey Building',
  'Dean of Faculty',
  'Distinguished academic leader driving excellence in IT management education, industry partnerships, and interdisciplinary research across FITCS.',
  ARRAY['IT Management', 'Telecommunications Strategy', 'Technology Leadership'],
  '/images/prof_koi_akrofi.png',
  false,
  false
),
(
  'dr-augustina-agor',
  'Dr. Augustina Dede Agor',
  'Senior Lecturer & Developers Hub Mentor',
  'PhD (Computer Science)',
  'Justice Aryeetey Building, Room 408',
  'Senior Lecturer / Hub Mentor',
  'Senior Lecturer in Computer Science and key mentor behind the UPSA Developers Hub initiative, guiding student practical project cohorts and software engineering research.',
  ARRAY['Computer Science', 'Software Engineering', 'Algorithmic Design', 'Student Mentorship'],
  '/images/dr_augustina_agor.png',
  false,
  false
),
(
  'dr-joshua-ofoeda',
  'Dr. Joshua Kwaku Ofoeda',
  'Head of Department, IT Studies',
  'PhD (Information Systems)',
  'Justice Aryeetey Building, Room 410',
  'Head of Department',
  'Head of Department leading academic excellence, curriculum innovation, and strategic industry alignment across all IT Studies degree and diploma programmes.',
  ARRAY['Information Systems', 'IT Governance', 'Digital Health & Tech Strategy'],
  '/images/dr_joshua_ofoeda.png',
  true,
  false
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  academic_degree = EXCLUDED.academic_degree,
  office_location = EXCLUDED.office_location,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  specialization = EXCLUDED.specialization,
  avatar_url = EXCLUDED.avatar_url,
  is_hod = EXCLUDED.is_hod,
  is_unconfirmed_hod = EXCLUDED.is_unconfirmed_hod;

-- 4. SEED PROMO SLIDES (4 Records)
INSERT INTO promo_slides (id, badge_text, title, subtext, image_url, cta_text, cta_link)
VALUES
(
  'congregation-2026',
  '14TH CONGREGATION CEREMONY',
  '2026 Graduating Class — Undergraduate & Diploma',
  'Celebrating the achievements and practical excellence of our Department of Information Technology Studies graduates.',
  '/images/upsa_congregation_2026.png',
  'Explore Academic Programmes',
  'academics'
),
(
  'admissions-2026',
  '2026/2027 ACADEMIC ADMISSIONS',
  'Admissions Open for Undergraduate & Postgraduate IT Programmes',
  'Apply now for BSc IT Management, BSc Data Science & Analytics, MSc Information Security, and MBA MIS.',
  '/images/bloodvault_preview.jpg',
  'Explore Programmes & Requirements',
  'academics'
),
(
  'dev-hub-cohort',
  'DEVELOPERS HUB INITIATIVE',
  'UPSA Developers Hub Practical Systems Cohort',
  'Student-led, department-guided engineering operating from the UPSA Computer Laboratory.',
  '/images/hms_preview.jpg',
  'Apply for 2026 Hub Cohort',
  'hub'
),
(
  'master-class-2026',
  'FACULTY INDUSTRY TRADITION',
  'Annual FITCS Executive Master Class Series',
  'Bringing Chief Technology Officers, cybersecurity auditors, and data executives directly into campus lectures.',
  '/images/bloodvault_preview.jpg',
  'View Community Details',
  'community'
)
ON CONFLICT (id) DO UPDATE SET
  badge_text = EXCLUDED.badge_text,
  title = EXCLUDED.title,
  subtext = EXCLUDED.subtext,
  image_url = EXCLUDED.image_url,
  cta_text = EXCLUDED.cta_text,
  cta_link = EXCLUDED.cta_link;

-- 5. SEED INSTITUTION INFO (1 Record)
INSERT INTO institution_info (id, university_name, motto, established, address, location, faculty_name, faculty_est, faculty_location, faculty_phone, switchboard, email, digital_address, dean, department_name, hod_name, is_hod_confirmed, faculty_vision, faculty_credo)
VALUES
(
  'primary',
  'University of Professional Studies, Accra (UPSA)',
  'Scholarship with Professionalism',
  '1965 (as IPS), Chartered 2008, Act 850 (2012)',
  'P.O. Box LG 149, Accra – Ghana',
  'UPSA Road, Madina, Accra, Ghana',
  'Faculty of Information Technology and Communication Studies (FITCS)',
  '2008',
  'Justice Aryeetey Building, 3rd & 4th Floors (Rooms 310/311/410/411/412/407/408/409)',
  '0303 961 753',
  '+233 303 937 544 / +233 303 937 542 / +233 303 958 571',
  'admissions@upsamail.edu.gh',
  'GM-037-0480',
  'Prof. Godfred Yaw Koi-Akrofi',
  'Department of Information Technology Studies',
  'Dr. Joshua Kwaku Ofoeda',
  true,
  'To be a distinguished faculty known for providing unique and excellent education and training in Communication and Information Technology Management.',
  'Efficient communication and IT for professionalism.'
)
ON CONFLICT (id) DO UPDATE SET
  university_name = EXCLUDED.university_name,
  motto = EXCLUDED.motto,
  established = EXCLUDED.established,
  address = EXCLUDED.address,
  location = EXCLUDED.location,
  faculty_name = EXCLUDED.faculty_name,
  faculty_est = EXCLUDED.faculty_est,
  faculty_location = EXCLUDED.faculty_location,
  faculty_phone = EXCLUDED.faculty_phone,
  switchboard = EXCLUDED.switchboard,
  email = EXCLUDED.email,
  digital_address = EXCLUDED.digital_address,
  dean = EXCLUDED.dean,
  department_name = EXCLUDED.department_name,
  hod_name = EXCLUDED.hod_name,
  is_hod_confirmed = EXCLUDED.is_hod_confirmed,
  faculty_vision = EXCLUDED.faculty_vision,
  faculty_credo = EXCLUDED.faculty_credo;

-- 6. SEED DEVELOPERS HUB (1 Record)
INSERT INTO developers_hub (id, nature, mission, mentor_name, mentor_degree, mentor_role, milestone_title, milestone_date, milestone_location, participants_count, milestone_description)
VALUES
(
  'primary',
  'Student-led, department-guided, project-based learning community.',
  'To foster collaborative software development, practical technical mentorship, hackathon-style innovation, and direct industry exposure.',
  'Dr. Augustina Dede Agor',
  'PhD (Computer Science)',
  'Department Mentor & Academic Advisor for Developers Hub',
  'UPSA Live Network Infrastructure Guided Exposure',
  '24–27 March 2026',
  'UPSA Data Center & Central Server Room',
  400,
  'Over 400 Developers Hub members engaged in a hands-on exploration of UPSA''s enterprise network infrastructure, guided by the university''s IT Services Department.'
)
ON CONFLICT (id) DO UPDATE SET
  nature = EXCLUDED.nature,
  mission = EXCLUDED.mission,
  mentor_name = EXCLUDED.mentor_name,
  mentor_degree = EXCLUDED.mentor_degree,
  mentor_role = EXCLUDED.mentor_role,
  milestone_title = EXCLUDED.milestone_title,
  milestone_date = EXCLUDED.milestone_date,
  milestone_location = EXCLUDED.milestone_location,
  participants_count = EXCLUDED.participants_count,
  milestone_description = EXCLUDED.milestone_description;


-- ----------------------------------------------------------------------------
-- VERIFICATION COUNT QUERY
-- ----------------------------------------------------------------------------
SELECT 'programmes' AS table_name, COUNT(*) FROM programmes
UNION ALL
SELECT 'projects' AS table_name, COUNT(*) FROM projects
UNION ALL
SELECT 'faculty' AS table_name, COUNT(*) FROM faculty
UNION ALL
SELECT 'promo_slides' AS table_name, COUNT(*) FROM promo_slides
UNION ALL
SELECT 'institution_info' AS table_name, COUNT(*) FROM institution_info
UNION ALL
SELECT 'developers_hub' AS table_name, COUNT(*) FROM developers_hub;
