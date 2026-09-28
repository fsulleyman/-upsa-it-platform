import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  PROGRAMMES as fallbackProgrammes,
  PROJECTS as fallbackProjects,
  FACULTY_DIRECTORY as fallbackFaculty,
  PROMO_SLIDES as fallbackPromoSlides,
  INSTITUTION_INFO as fallbackInstitutionInfo,
  HUB_DETAILS as fallbackHubDetails
} from '../data/groundTruth';
import type {
  AcademicProgramme,
  StudentProject,
  FacultyMember,
  PromoSlide,
  HeroContent,
  NavItem,
  FooterContent,
  FooterLink,
  SocialLink,
  SiteSettings,
  Course,
  ResearchProject,
  FacultyPublication
} from '../types';

const defaultHeroContent: HeroContent = {
  id: 'primary',
  topLine: 'UPSA ACCRA • FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES • EST. 1965',
  headline: 'Department of Information Technology Studies',
  subtext: 'University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.',
  primaryCtaText: 'Explore Academic Programmes',
  primaryCtaLink: 'academics/programmes',
  secondaryCtaText: 'Inspect Student Systems & Code',
  secondaryCtaLink: 'innovation'
};

const defaultNavItems: NavItem[] = [
  { id: 'nav-home', sectionId: 'home', label: 'HOME', displayOrder: 1, isActive: true },
  { id: 'nav-about', sectionId: 'about', label: 'ABOUT', displayOrder: 2, isActive: true },
  { id: 'nav-academics', sectionId: 'academics', label: 'ACADEMICS', displayOrder: 3, isActive: true },
  { id: 'nav-it-dept', sectionId: 'it-department', label: 'IT DEPARTMENT', displayOrder: 4, isActive: true },
  { id: 'nav-research', sectionId: 'research', label: 'RESEARCH', displayOrder: 5, isActive: true },
  { id: 'nav-hub', sectionId: 'developers-hub', label: 'DEVELOPERS HUB', displayOrder: 6, isActive: true },
  { id: 'nav-innovation', sectionId: 'innovation', label: 'INNOVATION', displayOrder: 7, isActive: true },
  { id: 'nav-community', sectionId: 'community', label: 'COMMUNITY', displayOrder: 8, isActive: true },
  { id: 'nav-contact', sectionId: 'contact', label: 'CONTACT', displayOrder: 9, isActive: true }
];

const defaultFooterContent: FooterContent = {
  id: 'primary',
  logoText: 'UPSA • IT STUDIES',
  mottoText: 'Scholarship with Professionalism',
  description: 'The Department of Information Technology Studies sits inside the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra.',
  digitalAddress: 'GA-193-4704',
  address: 'P.O. Box LG 149, Accra – Ghana',
  phoneAdmissions: '+233 30 250 0311',
  phoneSwitchboard: '+233 30 250 0312',
  email: 'infotech@upsamail.edu.gh',
  copyrightText: 'Department of Information Technology Studies — Faculty of Information Technology and Communication Studies, UPSA.',
  portalUrl: 'https://upsa.edu.gh'
};

const defaultFooterLinks: FooterLink[] = [
  { id: 'fl-1', columnTitle: 'ACADEMICS & COURSES', label: 'Academic Programmes', url: 'academics/programmes', isExternal: false, displayOrder: 1, isActive: true },
  { id: 'fl-2', columnTitle: 'ACADEMICS & COURSES', label: 'Course Directory Catalog', url: 'academics/courses', isExternal: false, displayOrder: 2, isActive: true },
  { id: 'fl-3', columnTitle: 'ACADEMICS & COURSES', label: 'UPSA Developers Hub', url: 'developers-hub', isExternal: false, displayOrder: 3, isActive: true },
  { id: 'fl-4', columnTitle: 'ACADEMICS & COURSES', label: 'Student Innovations & Showcase', url: 'innovation', isExternal: false, displayOrder: 4, isActive: true },
  { id: 'fl-5', columnTitle: 'DEPARTMENT & RESEARCH', label: 'Faculty & Staff Directory', url: 'it-department/faculty', isExternal: false, displayOrder: 1, isActive: true },
  { id: 'fl-6', columnTitle: 'DEPARTMENT & RESEARCH', label: 'Research & Publications', url: 'research', isExternal: false, displayOrder: 2, isActive: true },
  { id: 'fl-7', columnTitle: 'DEPARTMENT & RESEARCH', label: 'Faculty Secretariat Contact', url: 'contact', isExternal: false, displayOrder: 3, isActive: true },
  { id: 'fl-8', columnTitle: 'DEPARTMENT & RESEARCH', label: 'Official UPSA Website', url: 'https://upsa.edu.gh', isExternal: true, displayOrder: 4, isActive: true }
];

const defaultSocialLinks: SocialLink[] = [];

const defaultSiteSettings: SiteSettings = {
  id: 'primary',
  siteTitle: 'UPSA Department of Information Technology Studies',
  metaDescription: 'Official web portal for the Department of IT Studies at UPSA, Accra, Ghana.',
  organizationName: 'Department of Information Technology Studies',
  canonicalUrl: 'https://upsa.edu.gh'
};

const defaultCourses: Course[] = [
  {
    id: 'c-prog-101',
    courseCode: 'BITM 101',
    title: 'Programming Fundamentals & Object-Oriented Design',
    description: 'Introduction to computational thinking, algorithms, data structures, and object-oriented programming concepts in Java and Python.',
    level: 'Undergraduate',
    semester: 'Semester 1',
    creditHours: 3,
    displayOrder: 1,
    isActive: true,
    programmeIds: ['bsc-it-mgt'],
    lecturerIds: ['dr-joshua-ofoeda']
  },
  {
    id: 'c-db-201',
    courseCode: 'BITM 201',
    title: 'Database Management Systems & SQL Architecture',
    description: 'Relational database theory, ER modeling, SQL querying, transaction management, indexing, and enterprise database administration.',
    level: 'Undergraduate',
    semester: 'Semester 2',
    creditHours: 3,
    displayOrder: 2,
    isActive: true,
    programmeIds: ['bsc-it-mgt', 'bsc-ds-analytics'],
    lecturerIds: ['dr-augustina-dede-agor']
  },
  {
    id: 'c-net-202',
    courseCode: 'BITM 202',
    title: 'Enterprise Computer Networks & Cybersecurity',
    description: 'Data communications, OSI and TCP/IP protocol stacks, routing, switching, network security policies, and firewall configurations.',
    level: 'Undergraduate',
    semester: 'Semester 2',
    creditHours: 3,
    displayOrder: 3,
    isActive: true,
    programmeIds: ['bsc-it-mgt'],
    lecturerIds: ['dr-joshua-ofoeda']
  },
  {
    id: 'c-ai-301',
    courseCode: 'BDSA 301',
    title: 'Applied Machine Learning & Pattern Recognition',
    description: 'Supervised and unsupervised learning, classification, regression, neural networks, decision trees, and predictive modeling using Python.',
    level: 'Undergraduate',
    semester: 'Semester 1',
    creditHours: 3,
    displayOrder: 4,
    isActive: true,
    programmeIds: ['bsc-ds-analytics'],
    lecturerIds: ['dr-augustina-dede-agor']
  },
  {
    id: 'c-sec-501',
    courseCode: 'MIS 501',
    title: 'Enterprise Information Security Management',
    description: 'Postgraduate course covering governance frameworks, ISO 27001 standards, vulnerability auditing, threat intelligence, and disaster recovery.',
    level: 'Postgraduate',
    semester: 'Semester 1',
    creditHours: 3,
    displayOrder: 5,
    isActive: true,
    programmeIds: ['msc-info-security'],
    lecturerIds: ['dr-godfred-koi-akrofi']
  }
];

const defaultResearchProjects: ResearchProject[] = [
  {
    id: 'res-ai-health',
    title: 'AI-Driven Predictive Diagnostics for Regional Health Networks',
    description: 'Developing low-compute Machine Learning models to assist medical triage and blood inventory distribution in Ghana health clinics.',
    leadFacultyId: 'dr-augustina-dede-agor',
    leadFacultyName: 'Dr. Augustina Dede Agor',
    researchArea: 'Artificial Intelligence & Health Informatics',
    status: 'Active',
    startDate: '2025',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'res-cyber-sec',
    title: 'Cyber Threat Intelligence & Anomaly Detection in Financial Systems',
    description: 'Framework for real-time transaction auditing and anomaly detection in West African fintech platforms.',
    leadFacultyId: 'dr-joshua-ofoeda',
    leadFacultyName: 'Dr. Joshua Kwaku Ofoeda',
    researchArea: 'Cybersecurity & Financial Systems',
    status: 'Active',
    startDate: '2025',
    displayOrder: 2,
    isActive: true
  }
];

const defaultFacultyPublications: FacultyPublication[] = [
  {
    id: 'pub-1',
    facultyId: 'dr-joshua-ofoeda',
    facultyName: 'Dr. Joshua Kwaku Ofoeda',
    title: 'Evaluating Enterprise IT Governance Adoption in West African Higher Education Institutions',
    publicationType: 'Journal Article',
    journalOrVenue: 'International Journal of Information Management Systems',
    publicationYear: 2025,
    authors: ['Dr. Joshua Kwaku Ofoeda', 'Prof. Godfred Yaw Koi-Akrofi'],
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'pub-2',
    facultyId: 'dr-augustina-dede-agor',
    facultyName: 'Dr. Augustina Dede Agor',
    title: 'Machine Learning Classifiers for Mobile Health Diagnostics in Low-Bandwidth Networks',
    publicationType: 'Journal Article',
    journalOrVenue: 'IEEE Transactions on Computational Intelligence',
    publicationYear: 2025,
    authors: ['Dr. Augustina Dede Agor', 'Baffour Akoto Aninfeng'],
    displayOrder: 2,
    isActive: true
  }
];

export function useData() {
  const [programmes, setProgrammes] = useState<AcademicProgramme[]>(fallbackProgrammes);
  const [projects, setProjects] = useState<StudentProject[]>(fallbackProjects);
  const [faculty, setFaculty] = useState<FacultyMember[]>(fallbackFaculty);
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>(fallbackPromoSlides);
  const [institutionInfo] = useState(fallbackInstitutionInfo);
  const [hubDetails] = useState(fallbackHubDetails);

  // New CMS Dynamic State Variables
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(defaultFooterLinks);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

  // Module 5 Dynamic State Variables
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>(defaultResearchProjects);
  const [facultyPublications, setFacultyPublications] = useState<FacultyPublication[]>(defaultFacultyPublications);

  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);

  const fetchAllData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Fetch Programmes
      const { data: progData, error: progErr } = await supabase.from('programmes').select('*');
      if (!progErr && progData) {
        setProgrammes(
          progData.map((p) => ({
            id: p.id,
            code: p.code,
            name: p.name,
            level: p.level,
            duration: p.duration,
            tagline: p.tagline,
            description: p.description,
            skillsDeveloped: p.skills_developed || [],
            careerOutcomes: p.career_outcomes || [],
            coreModules: p.core_modules || [],
            entryRequirements: p.entry_requirements || [],
            isNew: p.is_new,
            imageUrl: p.image_url
          }))
        );
      }

      // Fetch Projects
      const { data: projData, error: projErr } = await supabase.from('projects').select('*');
      if (!projErr && projData) {
        setProjects(
          projData.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            fullDetails: p.full_details,
            category: p.category,
            technologies: p.technologies || [],
            studentName: p.student_name,
            studentRole: p.student_role,
            mentorName: p.mentor_name,
            hubAffiliation: p.hub_affiliation,
            isVerifiedReal: p.is_verified_real,
            isSample: p.is_sample,
            imageUrl: p.image_url,
            articleUrl: p.article_url,
            articleSource: p.article_source,
            githubUrl: p.github_url,
            demoUrl: p.demo_url,
            date: p.date,
            featured: p.featured
          }))
        );
      }

      // Fetch Faculty
      const { data: facData, error: facErr } = await supabase.from('faculty').select('*');
      if (!facErr && facData) {
        setFaculty(
          facData.map((f) => ({
            id: f.id,
            name: f.name,
            title: f.title,
            academicDegree: f.academic_degree,
            officeLocation: f.office_location,
            role: f.role,
            bio: f.bio,
            specialization: f.specialization || [],
            avatarUrl: f.avatar_url,
            isHOD: f.is_hod,
            isUnconfirmedHOD: f.is_unconfirmed_hod,
            email: f.email || `${f.id.replace(/-/g, '.')}@upsamail.edu.gh`,
            phone: f.phone || '+233 303 961 753',
            qualifications: f.qualifications && f.qualifications.length > 0 ? f.qualifications : [f.academic_degree || 'BSc / MSc Computer Science'],
            researchInterests: f.research_interests && f.research_interests.length > 0 ? f.research_interests : f.specialization || ['Information Technology'],
            teachingAreas: f.teaching_areas && f.teaching_areas.length > 0 ? f.teaching_areas : f.specialization || ['Software Systems'],
            linkedinUrl: f.linkedin_url,
            googleScholarUrl: f.google_scholar_url,
            orcidUrl: f.orcid_url,
            profileSlug: f.profile_slug || f.id,
            displayOrder: f.display_order || 0,
            isActive: f.is_active ?? true
          }))
        );
      }

      // Fetch Promo Slides
      const { data: slideData, error: slideErr } = await supabase.from('promo_slides').select('*');
      if (!slideErr && slideData) {
        setPromoSlides(
          slideData.map((s) => ({
            id: s.id,
            badgeText: s.badge_text,
            title: s.title,
            subtext: s.subtext,
            imageUrl: s.image_url,
            ctaText: s.cta_text,
            ctaLink: s.cta_link
          }))
        );
      }

      // Fetch Courses
      const { data: cData, error: cErr } = await supabase.from('courses').select('*').order('display_order', { ascending: true });
      if (!cErr && cData && cData.length > 0) {
        setCourses(
          cData.map((c) => ({
            id: c.id,
            courseCode: c.course_code,
            title: c.title,
            description: c.description,
            level: c.level,
            semester: c.semester,
            creditHours: c.credit_hours,
            courseOutlineUrl: c.course_outline_url,
            displayOrder: c.display_order,
            isActive: c.is_active
          }))
        );
      }

      // Fetch Research Projects
      const { data: rpData, error: rpErr } = await supabase.from('research_projects').select('*').order('display_order', { ascending: true });
      if (!rpErr && rpData && rpData.length > 0) {
        setResearchProjects(
          rpData.map((rp) => ({
            id: rp.id,
            title: rp.title,
            description: rp.description,
            leadFacultyId: rp.lead_faculty_id,
            researchArea: rp.research_area,
            status: rp.status,
            startDate: rp.start_date,
            endDate: rp.end_date,
            imageUrl: rp.image_url,
            externalUrl: rp.external_url,
            displayOrder: rp.display_order,
            isActive: rp.is_active
          }))
        );
      }

      // Fetch Faculty Publications
      const { data: fpData, error: fpErr } = await supabase.from('faculty_publications').select('*').order('publication_year', { ascending: false });
      if (!fpErr && fpData && fpData.length > 0) {
        setFacultyPublications(
          fpData.map((fp) => ({
            id: fp.id,
            facultyId: fp.faculty_id,
            title: fp.title,
            publicationType: fp.publication_type,
            journalOrVenue: fp.journal_or_venue,
            publicationYear: fp.publication_year,
            authors: fp.authors || [],
            url: fp.url,
            doi: fp.doi,
            displayOrder: fp.display_order,
            isActive: fp.is_active
          }))
        );
      }

      // Fetch Hero Section
      const { data: heroData, error: heroErr } = await supabase.from('hero_section').select('*').single();
      if (!heroErr && heroData) {
        setHeroContent({
          id: heroData.id,
          topLine: heroData.top_line || defaultHeroContent.topLine,
          headline: heroData.headline || defaultHeroContent.headline,
          subtext: heroData.subtext || defaultHeroContent.subtext,
          primaryCtaText: heroData.primary_cta_text || defaultHeroContent.primaryCtaText,
          primaryCtaLink: heroData.primary_cta_link || defaultHeroContent.primaryCtaLink,
          secondaryCtaText: heroData.secondary_cta_text || defaultHeroContent.secondaryCtaText,
          secondaryCtaLink: heroData.secondary_cta_link || defaultHeroContent.secondaryCtaLink,
          imageUrl: heroData.image_url
        });
      }

      // Fetch Navigation Items
      const { data: navData, error: navErr } = await supabase.from('nav_items').select('*').order('display_order', { ascending: true });
      if (!navErr && navData && navData.length > 0) {
        setNavItems(
          navData.map((n) => ({
            id: n.id,
            sectionId: n.section_id,
            label: n.label,
            displayOrder: n.display_order,
            isActive: n.is_active
          }))
        );
      }

      // Fetch Footer Content
      const { data: footerData, error: footerErr } = await supabase.from('footer_content').select('*').single();
      if (!footerErr && footerData) {
        setFooterContent({
          id: footerData.id,
          logoText: footerData.logo_text || defaultFooterContent.logoText,
          mottoText: footerData.motto_text || defaultFooterContent.mottoText,
          description: footerData.description || defaultFooterContent.description,
          digitalAddress: footerData.digital_address || defaultFooterContent.digitalAddress,
          address: footerData.address || defaultFooterContent.address,
          phoneAdmissions: footerData.phone_admissions || defaultFooterContent.phoneAdmissions,
          phoneSwitchboard: footerData.phone_switchboard || defaultFooterContent.phoneSwitchboard,
          email: footerData.email || defaultFooterContent.email,
          copyrightText: footerData.copyright_text || defaultFooterContent.copyrightText,
          portalUrl: footerData.portal_url || defaultFooterContent.portalUrl
        });
      }

      // Fetch Footer Links
      const { data: flData, error: flErr } = await supabase.from('footer_links').select('*').order('display_order', { ascending: true });
      if (!flErr && flData && flData.length > 0) {
        setFooterLinks(
          flData.map((fl) => ({
            id: fl.id,
            columnTitle: fl.column_title,
            label: fl.label,
            url: fl.url,
            isExternal: fl.is_external,
            displayOrder: fl.display_order,
            isActive: fl.is_active
          }))
        );
      }

      // Fetch Social Links
      const { data: socData, error: socErr } = await supabase.from('social_links').select('*').order('display_order', { ascending: true });
      if (!socErr && socData) {
        setSocialLinks(
          socData.map((sl) => ({
            id: sl.id,
            platform: sl.platform,
            url: sl.url,
            iconName: sl.icon_name,
            displayOrder: sl.display_order,
            isActive: sl.is_active
          }))
        );
      }

      // Fetch Site Settings
      const { data: ssData, error: ssErr } = await supabase.from('site_settings').select('*').single();
      if (!ssErr && ssData) {
        setSiteSettings({
          id: ssData.id,
          siteTitle: ssData.site_title || defaultSiteSettings.siteTitle,
          metaDescription: ssData.meta_description || defaultSiteSettings.metaDescription,
          organizationName: ssData.organization_name || defaultSiteSettings.organizationName,
          canonicalUrl: ssData.canonical_url || defaultSiteSettings.canonicalUrl,
          shareImageUrl: ssData.share_image_url
        });
      }

    } catch (err) {
      console.warn('Supabase fetch notice: using static fallback data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();

    // Re-fetch on window focus or hashchange to ensure fresh state
    const handleFocus = () => fetchAllData();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('hashchange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('hashchange', handleFocus);
    };
  }, [fetchAllData]);

  return {
    programmes,
    projects,
    faculty,
    promoSlides,
    institutionInfo,
    hubDetails,
    heroContent,
    navItems,
    footerContent,
    footerLinks,
    socialLinks,
    siteSettings,
    courses,
    researchProjects,
    facultyPublications,
    loading,
    refreshData: fetchAllData
  };
}
