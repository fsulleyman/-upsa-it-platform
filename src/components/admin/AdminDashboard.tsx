import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useData } from '../../hooks/useData';
import {
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  ShieldAlert,
  CheckCircle,
  LayoutDashboard,
  Compass,
  Megaphone,
  GraduationCap,
  FolderGit2,
  Users,
  LayoutList,
  Share2,
  Settings,
  BookOpen,
  Microscope
} from 'lucide-react';
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
} from '../../types';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { logout, isAdminLoggedIn } = useAuth();
  const {
    programmes,
    projects,
    faculty,
    courses,
    researchProjects,
    facultyPublications,
    promoSlides,
    heroContent,
    navItems,
    footerContent,
    footerLinks,
    socialLinks,
    siteSettings,
    refreshData
  } = useData();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'hero'
    | 'navigation'
    | 'programmes'
    | 'courses'
    | 'projects'
    | 'faculty'
    | 'research'
    | 'footer'
    | 'social'
    | 'settings'
  >('overview');
  const [notice, setNotice] = useState<string | null>(null);

  const { login } = useAuth();

  // Form Editing States for all CMS Modules
  const [editingProg, setEditingProg] = useState<Partial<AcademicProgramme> | null>(null);
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<StudentProject> | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Partial<FacultyMember> | null>(null);
  const [editingResearch, setEditingResearch] = useState<Partial<ResearchProject> | null>(null);
  const [editingPub, setEditingPub] = useState<Partial<FacultyPublication> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<PromoSlide> | null>(null);
  const [editingHero, setEditingHero] = useState<Partial<HeroContent> | null>(null);
  const [editingNavItem, setEditingNavItem] = useState<Partial<NavItem> | null>(null);
  const [editingFooterContent, setEditingFooterContent] = useState<Partial<FooterContent> | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<Partial<FooterLink> | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<Partial<SocialLink> | null>(null);
  const [editingSiteSettings, setEditingSiteSettings] = useState<Partial<SiteSettings> | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await login(emailInput, passwordInput);
    if (res.error) {
      setLoginError(res.error);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full bg-[#003366] text-[#F2B705] border border-[#F2B705]/40 text-xs font-bold font-mono">
              UPSA IT STUDIES SECURE GATEWAY
            </span>
            <h2 className="text-2xl font-extrabold text-white mt-3">Admin Portal Login</h2>
            <p className="text-slate-400 text-xs mt-1">Authenticate to manage live department content</p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-200 text-xs font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#003366]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow-md mt-2"
            >
              Sign In to Admin Portal
            </button>

            <button
              type="button"
              onClick={onNavigateHome}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 block"
            >
              ← Back to Main Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // ==========================================
  // 1. SAVE & DELETE: ACADEMIC PROGRAMMES
  // ==========================================
  const handleSaveProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProg?.name || !editingProg?.code) {
      alert('Programme Name and Code are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingProg.id || editingProg.code.toLowerCase().trim().replace(/\s+/g, '-'),
        code: editingProg.code.trim(),
        name: editingProg.name.trim(),
        level: editingProg.level || 'Undergraduate',
        duration: editingProg.duration || '4 Years',
        tagline: editingProg.tagline || '',
        description: editingProg.description || '',
        image_url: editingProg.imageUrl || '',
        skills_developed: editingProg.skillsDeveloped || [],
        career_outcomes: editingProg.careerOutcomes || [],
        core_modules: editingProg.coreModules || [],
        entry_requirements: editingProg.entryRequirements || [],
        is_new: editingProg.isNew || false
      };

      const { error } = await supabase.from('programmes').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingProg(null);
    showNotification('Academic Programme saved successfully!');
  };

  const handleDeleteProgramme = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('programmes').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Programme deleted.');
  };

  // ==========================================
  // 2. SAVE & DELETE: COURSES
  // ==========================================
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.code || !editingCourse?.name) {
      alert('Course Code and Name are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingCourse.id || editingCourse.code.toLowerCase().trim().replace(/\s+/g, '-'),
        code: editingCourse.code.trim(),
        name: editingCourse.name.trim(),
        level: editingCourse.level || '100',
        credits: Number(editingCourse.credits) || 3,
        category: editingCourse.category || 'Core',
        description: editingCourse.description || '',
        syllabus: editingCourse.syllabus || [],
        prerequisites: editingCourse.prerequisites || [],
        learning_outcomes: editingCourse.learningOutcomes || []
      };

      const { error } = await supabase.from('courses').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingCourse(null);
    showNotification('Course saved successfully!');
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Course deleted.');
  };

  // ==========================================
  // 3. SAVE & DELETE: STUDENT PROJECTS
  // ==========================================
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj?.title || !editingProj?.studentName) {
      alert('Project Title and Student Name are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingProj.id || editingProj.title.toLowerCase().trim().replace(/\s+/g, '-'),
        title: editingProj.title.trim(),
        subtitle: editingProj.subtitle || '',
        description: editingProj.description || '',
        full_details: editingProj.fullDetails || '',
        category: editingProj.category || 'Web Development',
        technologies: editingProj.technologies || [],
        student_name: editingProj.studentName.trim(),
        student_role: editingProj.studentRole || 'Student Developer',
        mentor_name: editingProj.mentorName || 'Dr. Augustina Dede Agor',
        hub_affiliation: editingProj.hubAffiliation || 'UPSA Developers Hub',
        is_verified_real: editingProj.isVerifiedReal || false,
        is_sample: editingProj.isSample || false,
        image_url: editingProj.imageUrl || '',
        article_url: editingProj.articleUrl || '',
        article_source: editingProj.articleSource || '',
        github_url: editingProj.githubUrl || '',
        demo_url: editingProj.demoUrl || '',
        date: editingProj.date || '2026',
        featured: editingProj.featured || false
      };

      const { error } = await supabase.from('projects').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingProj(null);
    showNotification('Student Project saved successfully!');
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Student Project deleted.');
  };

  // ==========================================
  // 4. SAVE & DELETE: FACULTY DIRECTORY
  // ==========================================
  const handleSaveFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty?.name || !editingFaculty?.title) {
      alert('Faculty Name and Title are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingFaculty.id || editingFaculty.name.toLowerCase().trim().replace(/\s+/g, '-'),
        slug: editingFaculty.slug || editingFaculty.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        name: editingFaculty.name.trim(),
        title: editingFaculty.title.trim(),
        academic_degree: editingFaculty.academicDegree || '',
        office_location: editingFaculty.officeLocation || '',
        role: editingFaculty.role || 'Lecturer',
        bio: editingFaculty.bio || '',
        biography: editingFaculty.biography || editingFaculty.bio || '',
        specialization: editingFaculty.specialization || [],
        qualifications: editingFaculty.qualifications || [],
        research_interests: editingFaculty.researchInterests || [],
        teaching_areas: editingFaculty.teachingAreas || [],
        google_scholar_url: editingFaculty.googleScholarUrl || '',
        orcid_id: editingFaculty.orcidId || '',
        avatar_url: editingFaculty.avatarUrl || '',
        is_hod: editingFaculty.isHOD || false,
        is_unconfirmed_hod: editingFaculty.isUnconfirmedHOD || false
      };

      const { error } = await supabase.from('faculty').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingFaculty(null);
    showNotification('Faculty Directory entry saved successfully!');
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty record?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Faculty record deleted.');
  };

  // ==========================================
  // 5. SAVE & DELETE: RESEARCH PROJECTS & PUBS
  // ==========================================
  const handleSaveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResearch?.title || !editingResearch?.leadResearcher) {
      alert('Title and Lead Researcher are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingResearch.id || editingResearch.title.toLowerCase().trim().replace(/\s+/g, '-'),
        title: editingResearch.title.trim(),
        lead_researcher: editingResearch.leadResearcher.trim(),
        department: editingResearch.department || 'Department of Information Technology',
        abstract: editingResearch.abstract || '',
        status: editingResearch.status || 'Active',
        category: editingResearch.category || 'Artificial Intelligence',
        tags: editingResearch.tags || [],
        publication_year: editingResearch.publicationYear || '2026',
        paper_url: editingResearch.paperUrl || ''
      };

      const { error } = await supabase.from('research_projects').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingResearch(null);
    showNotification('Research Project saved successfully!');
  };

  const handleDeleteResearch = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research project?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('research_projects').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Research Project deleted.');
  };

  const handleSavePub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub?.title || !editingPub?.authors) {
      alert('Title and Authors are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingPub.id || editingPub.title.toLowerCase().trim().replace(/\s+/g, '-'),
        title: editingPub.title.trim(),
        authors: editingPub.authors || [],
        journal: editingPub.journal || '',
        publication_year: editingPub.publicationYear || '2026',
        doi: editingPub.doi || '',
        paper_url: editingPub.paperUrl || '',
        citation_count: Number(editingPub.citationCount) || 0
      };

      const { error } = await supabase.from('faculty_publications').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingPub(null);
    showNotification('Faculty Publication saved successfully!');
  };

  const handleDeletePub = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('faculty_publications').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Publication deleted.');
  };

  // ==========================================
  // 6. SAVE & DELETE: ANNOUNCEMENT SLIDER
  // ==========================================
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide?.title || !editingSlide?.imageUrl) {
      alert('Slide Title and Image URL are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingSlide.id || editingSlide.title.toLowerCase().trim().replace(/\s+/g, '-'),
        badge_text: editingSlide.badgeText || '',
        title: editingSlide.title.trim(),
        subtext: editingSlide.subtext || '',
        image_url: editingSlide.imageUrl.trim(),
        cta_text: editingSlide.ctaText || 'Learn More',
        cta_link: editingSlide.ctaLink || 'academics'
      };

      const { error } = await supabase.from('promo_slides').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingSlide(null);
    showNotification('Announcement Slide saved successfully!');
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('promo_slides').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Announcement slide deleted.');
  };

  // ==========================================
  // 7. SAVE: HERO & BANNER CONTENT
  // ==========================================
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: 'primary',
        top_line: editingHero?.topLine || heroContent.topLine,
        headline: editingHero?.headline || heroContent.headline,
        subtext: editingHero?.subtext || heroContent.subtext,
        primary_cta_text: editingHero?.primaryCtaText || heroContent.primaryCtaText,
        primary_cta_link: editingHero?.primaryCtaLink || heroContent.primaryCtaLink,
        secondary_cta_text: editingHero?.secondaryCtaText || heroContent.secondaryCtaText,
        secondary_cta_link: editingHero?.secondaryCtaLink || heroContent.secondaryCtaLink,
        image_url: editingHero?.imageUrl || heroContent.imageUrl || ''
      };

      const { error } = await supabase.from('hero_section').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingHero(null);
    showNotification('Hero Section content saved successfully!');
  };

  // ==========================================
  // 8. SAVE & DELETE: NAVIGATION ITEMS
  // ==========================================
  const handleSaveNavItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNavItem?.label || !editingNavItem?.sectionId) {
      alert('Label and Section ID are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingNavItem.id || `nav-${editingNavItem.sectionId}`,
        section_id: editingNavItem.sectionId,
        label: editingNavItem.label.trim().toUpperCase(),
        display_order: Number(editingNavItem.displayOrder) || 0,
        is_active: editingNavItem.isActive ?? true
      };

      const { error } = await supabase.from('nav_items').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingNavItem(null);
    showNotification('Navigation Item saved successfully!');
  };

  const handleDeleteNavItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('nav_items').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Navigation item deleted.');
  };

  // ==========================================
  // 9. SAVE: FOOTER CONTENT & LINKS
  // ==========================================
  const handleSaveFooterContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: 'primary',
        logo_text: editingFooterContent?.logoText || footerContent.logoText,
        motto_text: editingFooterContent?.mottoText || footerContent.mottoText,
        description: editingFooterContent?.description || footerContent.description,
        digital_address: editingFooterContent?.digitalAddress || footerContent.digitalAddress,
        address: editingFooterContent?.address || footerContent.address,
        phone_admissions: editingFooterContent?.phoneAdmissions || footerContent.phoneAdmissions,
        phone_switchboard: editingFooterContent?.phoneSwitchboard || footerContent.phoneSwitchboard,
        email: editingFooterContent?.email || footerContent.email,
        copyright_text: editingFooterContent?.copyrightText || footerContent.copyrightText,
        portal_url: editingFooterContent?.portalUrl || footerContent.portalUrl
      };

      const { error } = await supabase.from('footer_content').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingFooterContent(null);
    showNotification('Footer Branding & Secretariat Info saved successfully!');
  };

  const handleSaveFooterLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFooterLink?.label || !editingFooterLink?.url || !editingFooterLink?.columnTitle) {
      alert('Column Title, Label, and URL are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingFooterLink.id || `fl-${Date.now()}`,
        column_title: editingFooterLink.columnTitle.trim().toUpperCase(),
        label: editingFooterLink.label.trim(),
        url: editingFooterLink.url.trim(),
        is_external: editingFooterLink.isExternal || false,
        display_order: Number(editingFooterLink.displayOrder) || 0,
        is_active: editingFooterLink.isActive ?? true
      };

      const { error } = await supabase.from('footer_links').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingFooterLink(null);
    showNotification('Footer Link saved successfully!');
  };

  const handleDeleteFooterLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this footer link?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('footer_links').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Footer link deleted.');
  };

  // ==========================================
  // 10. SAVE & DELETE: SOCIAL LINKS
  // ==========================================
  const handleSaveSocialLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocialLink?.platform || !editingSocialLink?.url) {
      alert('Platform Name and URL are required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: editingSocialLink.id || `soc-${Date.now()}`,
        platform: editingSocialLink.platform.trim(),
        url: editingSocialLink.url.trim(),
        icon_name: editingSocialLink.iconName || 'Globe',
        display_order: Number(editingSocialLink.displayOrder) || 0,
        is_active: editingSocialLink.isActive ?? true
      };

      const { error } = await supabase.from('social_links').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingSocialLink(null);
    showNotification('Social Link saved successfully!');
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) {
        alert(`Supabase Delete Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Social link deleted.');
  };

  // ==========================================
  // 11. SAVE: SITE SETTINGS & SEO
  // ==========================================
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: 'primary',
        site_title: editingSiteSettings?.siteTitle || siteSettings.siteTitle,
        meta_description: editingSiteSettings?.metaDescription || siteSettings.metaDescription,
        organization_name: editingSiteSettings?.organizationName || siteSettings.organizationName,
        canonical_url: editingSiteSettings?.canonicalUrl || siteSettings.canonicalUrl,
        share_image_url: editingSiteSettings?.shareImageUrl || siteSettings.shareImageUrl || ''
      };

      const { error } = await supabase.from('site_settings').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingSiteSettings(null);
    showNotification('Site Settings & SEO metadata saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Top Header Bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#F2B705] animate-pulse" />
          <h1 className="text-lg font-extrabold text-white">UPSA IT Studies — Central CMS Control Center</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Banner Alert Notice */}
      {notice && (
        <div className="bg-[#003366] border-b border-[#F2B705]/50 px-6 py-2.5 text-xs font-bold text-white flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#F2B705]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Navigation Tabs (CMS Modules) */}
      <div className="px-6 pt-6 flex gap-2 border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'overview' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'hero' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Hero & Banners ({promoSlides.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('navigation')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'navigation' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Navigation ({navItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'programmes' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Programmes ({programmes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'courses' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses ({courses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'projects' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Projects ({projects.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'faculty' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty ({faculty.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('research')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'research' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Microscope className="w-4 h-4" />
          <span>Research ({researchProjects.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'footer' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          <span>Footer ({footerLinks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'social' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social ({socialLinks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'settings' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Site SEO</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* TAB 1: OVERVIEW & DASHBOARD METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-base font-extrabold text-white">CMS Platform System Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Academic Programmes</span>
                <span className="text-3xl font-black text-[#F2B705]">{programmes.length}</span>
                <p className="text-[11px] text-slate-400">Live degrees in Supabase</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Department Courses</span>
                <span className="text-3xl font-black text-emerald-400">{courses.length}</span>
                <p className="text-[11px] text-slate-400">Undergraduate & Diploma courses</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student Projects</span>
                <span className="text-3xl font-black text-[#00AEEF]">{projects.length}</span>
                <p className="text-[11px] text-slate-400">Verified & sample projects</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faculty & Staff</span>
                <span className="text-3xl font-black text-purple-400">{faculty.length}</span>
                <p className="text-[11px] text-slate-400">Department lecturers & HOD</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
              <h3 className="text-sm font-extrabold text-[#F2B705]">Academic & CMS Content Health Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Research Projects Published:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{researchProjects.length} active</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Faculty Peer-Reviewed Publications:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{facultyPublications.length} papers</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Navigation Menu Links:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{navItems.length} active items</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Site Title:</span>
                  <span className="font-bold text-white truncate max-w-[200px]">{siteSettings.siteTitle}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO & BANNERS */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Homepage Hero Section Settings</h3>
                <button
                  type="button"
                  onClick={() => setEditingHero(heroContent)}
                  className="px-3 py-1.5 rounded bg-[#003366] text-white text-xs font-bold"
                >
                  Edit Hero Content
                </button>
              </div>

              {editingHero && (
                <form onSubmit={handleSaveHero} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Top Institutional Line</label>
                    <input
                      type="text"
                      value={editingHero.topLine ?? heroContent.topLine}
                      onChange={(e) => setEditingHero({ ...editingHero, topLine: e.target.value })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Main Headline *</label>
                    <input
                      type="text"
                      required
                      value={editingHero.headline ?? heroContent.headline}
                      onChange={(e) => setEditingHero({ ...editingHero, headline: e.target.value })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Subtext Description</label>
                    <textarea
                      rows={2}
                      value={editingHero.subtext ?? heroContent.subtext}
                      onChange={(e) => setEditingHero({ ...editingHero, subtext: e.target.value })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Hero Settings</button>
                    <button type="button" onClick={() => setEditingHero(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Announcement Slides */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Announcement Banner Slider</h3>
                <button
                  onClick={() => setEditingSlide({ title: '', imageUrl: '', ctaText: 'Learn More', ctaLink: 'academics' })}
                  className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Slide</span>
                </button>
              </div>

              {editingSlide && (
                <form onSubmit={handleSaveSlide} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                  <h4 className="font-bold text-[#F2B705]">{editingSlide.id ? 'Edit Slide' : 'New Slide Entry'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Slide Title *</label>
                      <input
                        type="text"
                        required
                        value={editingSlide.title || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Image URL *</label>
                      <input
                        type="text"
                        required
                        value={editingSlide.imageUrl || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Slide</button>
                    <button type="button" onClick={() => setEditingSlide(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Badge</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {promoSlides.map((slide) => (
                      <tr key={slide.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">{slide.title}</td>
                        <td className="p-3 font-mono">{slide.badgeText}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingSlide(slide)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteSlide(slide.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NAVIGATION */}
        {activeTab === 'navigation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Header Navigation Menu Items</h2>
              <button
                onClick={() => setEditingNavItem({ label: '', sectionId: 'home', displayOrder: navItems.length + 1 })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Nav Item</span>
              </button>
            </div>

            {editingNavItem && (
              <form onSubmit={handleSaveNavItem} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingNavItem.id ? 'Edit Nav Item' : 'New Nav Item'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Label *</label>
                    <input
                      type="text"
                      required
                      value={editingNavItem.label || ''}
                      onChange={(e) => setEditingNavItem({ ...editingNavItem, label: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Target Section ID *</label>
                    <input
                      type="text"
                      required
                      value={editingNavItem.sectionId || ''}
                      onChange={(e) => setEditingNavItem({ ...editingNavItem, sectionId: e.target.value as any })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Nav Item</button>
                  <button type="button" onClick={() => setEditingNavItem(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Order</th>
                    <th className="p-3">Label</th>
                    <th className="p-3">Section ID</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {navItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-[#F2B705]">{item.displayOrder}</td>
                      <td className="p-3 font-bold text-white">{item.label}</td>
                      <td className="p-3 font-mono text-[#00AEEF]">{item.sectionId}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingNavItem(item)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteNavItem(item.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: COURSES DIRECTORY */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Course Directory & Syllabi</h2>
              <button
                onClick={() => setEditingCourse({ code: '', name: '', level: '100', credits: 3, category: 'Core' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            {editingCourse && (
              <form onSubmit={handleSaveCourse} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingCourse.id ? 'Edit Course' : 'New Course Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Course Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BIT 101"
                      value={editingCourse.code || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Course Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Introduction to Programming"
                      value={editingCourse.name || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Credits</label>
                    <input
                      type="number"
                      value={editingCourse.credits ?? 3}
                      onChange={(e) => setEditingCourse({ ...editingCourse, credits: parseInt(e.target.value) || 3 })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Level</label>
                    <select
                      value={editingCourse.level || '100'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    >
                      <option value="100">Level 100</option>
                      <option value="200">Level 200</option>
                      <option value="300">Level 300</option>
                      <option value="400">Level 400</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="Core / Elective"
                      value={editingCourse.category || 'Core'}
                      onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCourse.description || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Course</button>
                  <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Credits</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-[#F2B705]">{c.code}</td>
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 font-mono">{c.level}</td>
                      <td className="p-3 font-mono">{c.credits}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingCourse(c)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteCourse(c.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROGRAMMES */}
        {activeTab === 'programmes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Academic Qualifications & Programmes</h2>
              <button
                onClick={() => setEditingProg({ name: '', code: '', level: 'Undergraduate', duration: '4 Years' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Programme</span>
              </button>
            </div>

            {editingProg && (
              <form onSubmit={handleSaveProgramme} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingProg.id ? 'Edit Programme' : 'New Programme Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Code *</label>
                    <input
                      type="text"
                      required
                      value={editingProg.code || ''}
                      onChange={(e) => setEditingProg({ ...editingProg, code: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProg.name || ''}
                      onChange={(e) => setEditingProg({ ...editingProg, name: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Programme</button>
                  <button type="button" onClick={() => setEditingProg(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Programme Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {programmes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-[#F2B705]">{p.code}</td>
                      <td className="p-3 font-bold text-white">{p.name}</td>
                      <td className="p-3">{p.level}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingProg(p)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteProgramme(p.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STUDENT PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Student Innovation Projects</h2>
              <button
                onClick={() => setEditingProj({ title: '', studentName: '', category: 'Web Development' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {editingProj && (
              <form onSubmit={handleSaveProject} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingProj.id ? 'Edit Project' : 'New Project Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProj.title || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProj.studentName || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, studentName: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Project</button>
                  <button type="button" onClick={() => setEditingProj(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Student</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">{p.title}</td>
                      <td className="p-3">{p.studentName}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingProj(p)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteProject(p.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: FACULTY DIRECTORY */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Faculty & Academic Profiles</h2>
              <button
                onClick={() => setEditingFaculty({ name: '', title: '', role: 'Lecturer' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Lecturer / Staff</span>
              </button>
            </div>

            {editingFaculty && (
              <form onSubmit={handleSaveFaculty} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingFaculty.id ? 'Edit Lecturer Profile' : 'New Lecturer Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.name || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Title / Designation *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Lecturer / Head of Department"
                      value={editingFaculty.title || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, title: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Highest Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. Ph.D. in Computer Science"
                      value={editingFaculty.academicDegree || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, academicDegree: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Office Location</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Block Office #204"
                      value={editingFaculty.officeLocation || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, officeLocation: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Biography & Background</label>
                  <textarea
                    rows={3}
                    value={editingFaculty.biography || editingFaculty.bio || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, biography: e.target.value, bio: e.target.value })}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Faculty Profile</button>
                  <button type="button" onClick={() => setEditingFaculty(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Degree</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {faculty.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">{f.name}</td>
                      <td className="p-3">{f.title}</td>
                      <td className="p-3 font-mono">{f.academicDegree}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingFaculty(f)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteFaculty(f.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: RESEARCH & PUBLICATIONS */}
        {activeTab === 'research' && (
          <div className="space-y-8">
            {/* Research Projects */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Department Research Projects</h3>
                <button
                  onClick={() => setEditingResearch({ title: '', leadResearcher: '', status: 'Active', category: 'Artificial Intelligence' })}
                  className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Research Project</span>
                </button>
              </div>

              {editingResearch && (
                <form onSubmit={handleSaveResearch} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                  <h4 className="font-bold text-[#F2B705]">{editingResearch.id ? 'Edit Research Project' : 'New Research Project'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingResearch.title || ''}
                        onChange={(e) => setEditingResearch({ ...editingResearch, title: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Lead Researcher *</label>
                      <input
                        type="text"
                        required
                        value={editingResearch.leadResearcher || ''}
                        onChange={(e) => setEditingResearch({ ...editingResearch, leadResearcher: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Research</button>
                    <button type="button" onClick={() => setEditingResearch(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Lead Researcher</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {researchProjects.map((rp) => (
                      <tr key={rp.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">{rp.title}</td>
                        <td className="p-3">{rp.leadResearcher}</td>
                        <td className="p-3 font-mono">{rp.category}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingResearch(rp)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteResearch(rp.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Faculty Publications */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Faculty Publications & Papers</h3>
                <button
                  onClick={() => setEditingPub({ title: '', authors: ['Dr. Joshua Ofoeda'], journal: '', publicationYear: '2026' })}
                  className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Publication</span>
                </button>
              </div>

              {editingPub && (
                <form onSubmit={handleSavePub} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                  <h4 className="font-bold text-[#F2B705]">{editingPub.id ? 'Edit Publication' : 'New Publication Entry'}</h4>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Paper Title *</label>
                    <input
                      type="text"
                      required
                      value={editingPub.title || ''}
                      onChange={(e) => setEditingPub({ ...editingPub, title: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Publication</button>
                    <button type="button" onClick={() => setEditingPub(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Paper Title</th>
                      <th className="p-3">Journal</th>
                      <th className="p-3">Year</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {facultyPublications.map((pub) => (
                      <tr key={pub.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">{pub.title}</td>
                        <td className="p-3">{pub.journal}</td>
                        <td className="p-3 font-mono">{pub.publicationYear}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingPub(pub)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeletePub(pub.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: FOOTER & LINKS */}
        {activeTab === 'footer' && (
          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Footer Branding & Contact Settings</h3>
                <button
                  type="button"
                  onClick={() => setEditingFooterContent(footerContent)}
                  className="px-3 py-1.5 rounded bg-[#003366] text-white font-bold"
                >
                  Edit Footer Content
                </button>
              </div>

              {editingFooterContent && (
                <form onSubmit={handleSaveFooterContent} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Logo Text</label>
                      <input
                        type="text"
                        value={editingFooterContent.logoText ?? footerContent.logoText}
                        onChange={(e) => setEditingFooterContent({ ...editingFooterContent, logoText: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Motto Text</label>
                      <input
                        type="text"
                        value={editingFooterContent.mottoText ?? footerContent.mottoText}
                        onChange={(e) => setEditingFooterContent({ ...editingFooterContent, mottoText: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Footer</button>
                    <button type="button" onClick={() => setEditingFooterContent(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Quick Links Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-[#F2B705]">Footer Quick Links</h3>
                <button
                  onClick={() => setEditingFooterLink({ columnTitle: 'QUICK LINKS', label: '', url: '' })}
                  className="px-3 py-1.5 rounded bg-[#003366] text-white font-bold text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Footer Link</span>
                </button>
              </div>

              {editingFooterLink && (
                <form onSubmit={handleSaveFooterLink} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Column Title *</label>
                      <input
                        type="text"
                        required
                        value={editingFooterLink.columnTitle || ''}
                        onChange={(e) => setEditingFooterLink({ ...editingFooterLink, columnTitle: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Link Label *</label>
                      <input
                        type="text"
                        required
                        value={editingFooterLink.label || ''}
                        onChange={(e) => setEditingFooterLink({ ...editingFooterLink, label: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">URL *</label>
                      <input
                        type="text"
                        required
                        value={editingFooterLink.url || ''}
                        onChange={(e) => setEditingFooterLink({ ...editingFooterLink, url: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Link</button>
                    <button type="button" onClick={() => setEditingFooterLink(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Column</th>
                      <th className="p-3">Label</th>
                      <th className="p-3">URL</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {footerLinks.map((fl) => (
                      <tr key={fl.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-mono text-[#F2B705]">{fl.columnTitle}</td>
                        <td className="p-3 font-bold text-white">{fl.label}</td>
                        <td className="p-3 font-mono">{fl.url}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingFooterLink(fl)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteFooterLink(fl.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SOCIAL */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Social Media Links</h2>
              <button
                onClick={() => setEditingSocialLink({ platform: '', url: '', iconName: 'Globe' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Link</span>
              </button>
            </div>

            {editingSocialLink && (
              <form onSubmit={handleSaveSocialLink} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Platform *</label>
                    <input
                      type="text"
                      required
                      value={editingSocialLink.platform || ''}
                      onChange={(e) => setEditingSocialLink({ ...editingSocialLink, platform: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">URL *</label>
                    <input
                      type="text"
                      required
                      value={editingSocialLink.url || ''}
                      onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Link</button>
                  <button type="button" onClick={() => setEditingSocialLink(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                  <tr>
                    <th className="p-3">Platform</th>
                    <th className="p-3">URL</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {socialLinks.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">{s.platform}</td>
                      <td className="p-3 font-mono">{s.url}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => setEditingSocialLink(s)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteSocialLink(s.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
            <h3 className="text-sm font-extrabold text-[#F2B705]">Global Site SEO & Branding Metadata</h3>
            <form onSubmit={handleSaveSiteSettings} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Site Title Tag</label>
                <input
                  type="text"
                  value={editingSiteSettings?.siteTitle ?? siteSettings.siteTitle}
                  onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, siteTitle: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={editingSiteSettings?.metaDescription ?? siteSettings.metaDescription}
                  onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, metaDescription: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Site Settings</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
