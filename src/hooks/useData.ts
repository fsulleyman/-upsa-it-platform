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
  SiteSettings
} from '../types';

const defaultHeroContent: HeroContent = {
  id: 'primary',
  topLine: 'UPSA ACCRA • FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES • EST. 1965',
  headline: 'Department of Information Technology Studies',
  subtext: 'University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.',
  primaryCtaText: 'Explore Academic Programmes',
  primaryCtaLink: 'academics',
  secondaryCtaText: 'Inspect Student Systems & Code',
  secondaryCtaLink: 'innovation'
};

const defaultNavItems: NavItem[] = [
  { id: 'nav-home', sectionId: 'home', label: 'HOME', displayOrder: 1, isActive: true },
  { id: 'nav-about', sectionId: 'about', label: 'ABOUT', displayOrder: 2, isActive: true },
  { id: 'nav-academics', sectionId: 'academics', label: 'ACADEMICS', displayOrder: 3, isActive: true },
  { id: 'nav-hub', sectionId: 'hub', label: 'DEVELOPERS HUB', displayOrder: 4, isActive: true },
  { id: 'nav-innovation', sectionId: 'innovation', label: 'INNOVATION', displayOrder: 5, isActive: true },
  { id: 'nav-community', sectionId: 'community', label: 'COMMUNITY', displayOrder: 6, isActive: true },
  { id: 'nav-contact', sectionId: 'contact', label: 'CONTACT', displayOrder: 7, isActive: true }
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
  { id: 'fl-1', columnTitle: 'ACADEMICS & HUB', label: 'Academic Programmes', url: 'academics', isExternal: false, displayOrder: 1, isActive: true },
  { id: 'fl-2', columnTitle: 'ACADEMICS & HUB', label: 'UPSA Developers Hub', url: 'hub', isExternal: false, displayOrder: 2, isActive: true },
  { id: 'fl-3', columnTitle: 'ACADEMICS & HUB', label: 'Student Innovations & Showcase', url: 'innovation', isExternal: false, displayOrder: 3, isActive: true },
  { id: 'fl-4', columnTitle: 'ACADEMICS & HUB', label: 'DataCamp Classroom Integration', url: 'community', isExternal: false, displayOrder: 4, isActive: true },
  { id: 'fl-5', columnTitle: 'ADMISSIONS & FACULTY', label: 'About FITCS Faculty', url: 'about', isExternal: false, displayOrder: 1, isActive: true },
  { id: 'fl-6', columnTitle: 'ADMISSIONS & FACULTY', label: 'Faculty Secretariat Contact', url: 'contact', isExternal: false, displayOrder: 2, isActive: true },
  { id: 'fl-7', columnTitle: 'ADMISSIONS & FACULTY', label: 'Official UPSA Website', url: 'https://upsa.edu.gh', isExternal: true, displayOrder: 3, isActive: true }
];

const defaultSocialLinks: SocialLink[] = [];

const defaultSiteSettings: SiteSettings = {
  id: 'primary',
  siteTitle: 'UPSA Department of Information Technology Studies',
  metaDescription: 'Official web portal for the Department of IT Studies at UPSA, Accra, Ghana.',
  organizationName: 'Department of Information Technology Studies',
  canonicalUrl: 'https://upsa.edu.gh'
};

export function useData() {
  const [programmes, setProgrammes] = useState<AcademicProgramme[]>(fallbackProgrammes);
  const [projects, setProjects] = useState<StudentProject[]>(fallbackProjects);
  const [faculty, setFaculty] = useState<FacultyMember[]>(fallbackFaculty);
  const [promoSlides, setPromoSlides] = useState<PromoSlide[]>(fallbackPromoSlides);
  const [institutionInfo, setInstitutionInfo] = useState(fallbackInstitutionInfo);
  const [hubDetails, setHubDetails] = useState(fallbackHubDetails);

  // New CMS Dynamic State Variables
  const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
  const [navItems, setNavItems] = useState<NavItem[]>(defaultNavItems);
  const [footerContent, setFooterContent] = useState<FooterContent>(defaultFooterContent);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(defaultFooterLinks);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(defaultSocialLinks);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);

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
            isUnconfirmedHOD: f.is_unconfirmed_hod
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

      // Fetch Institution Info
      const { data: instData, error: instErr } = await supabase.from('institution_info').select('*').single();
      if (!instErr && instData) {
        setInstitutionInfo({
          ...fallbackInstitutionInfo,
          universityName: instData.university_name || fallbackInstitutionInfo.universityName,
          motto: instData.motto || fallbackInstitutionInfo.motto,
          established: instData.established || fallbackInstitutionInfo.established,
          address: instData.address || fallbackInstitutionInfo.address,
          location: instData.location || fallbackInstitutionInfo.location,
          facultyName: instData.faculty_name || fallbackInstitutionInfo.facultyName,
          facultyEst: instData.faculty_est || fallbackInstitutionInfo.facultyEst,
          facultyLocation: instData.faculty_location || fallbackInstitutionInfo.facultyLocation,
          facultyPhone: instData.faculty_phone || fallbackInstitutionInfo.facultyPhone,
          switchboard: instData.switchboard || fallbackInstitutionInfo.switchboard,
          email: instData.email || fallbackInstitutionInfo.email,
          digitalAddress: instData.digital_address || fallbackInstitutionInfo.digitalAddress,
          dean: instData.dean || fallbackInstitutionInfo.dean,
          departmentName: instData.department_name || fallbackInstitutionInfo.departmentName,
          hodName: instData.hod_name || fallbackInstitutionInfo.hodName,
          isHodConfirmed: instData.is_hod_confirmed ?? fallbackInstitutionInfo.isHodConfirmed,
          facultyVision: instData.faculty_vision || fallbackInstitutionInfo.facultyVision,
          facultyCredo: instData.faculty_credo || fallbackInstitutionInfo.facultyCredo
        });
      }

      // Fetch Developers Hub Details
      const { data: hubData, error: hubErr } = await supabase.from('developers_hub').select('*').single();
      if (!hubErr && hubData) {
        setHubDetails({
          ...fallbackHubDetails,
          nature: hubData.nature || fallbackHubDetails.nature,
          mission: hubData.mission || fallbackHubDetails.mission,
          facultyMentor: {
            name: hubData.mentor_name || fallbackHubDetails.facultyMentor.name,
            degree: hubData.mentor_degree || fallbackHubDetails.facultyMentor.degree,
            role: hubData.mentor_role || fallbackHubDetails.facultyMentor.role,
            title: fallbackHubDetails.facultyMentor.title
          },
          milestone: {
            id: 'm1',
            date: hubData.milestone_date || fallbackHubDetails.milestone.date,
            title: hubData.milestone_title || fallbackHubDetails.milestone.title,
            location: hubData.milestone_location || fallbackHubDetails.milestone.location,
            participantsCount: String(hubData.participants_count || fallbackHubDetails.milestone.participantsCount),
            description: hubData.milestone_description || fallbackHubDetails.milestone.description,
            collaborators: fallbackHubDetails.milestone.collaborators,
            keyHighlights: fallbackHubDetails.milestone.keyHighlights
          }
        });
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
    loading,
    refreshData: fetchAllData
  };
}
