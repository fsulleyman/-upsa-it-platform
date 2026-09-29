import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useData } from '../../hooks/useData';
import { LogOut, ExternalLink, Plus, Trash2, Edit, ShieldAlert, CheckCircle, LayoutDashboard, Compass, Megaphone, GraduationCap, FolderGit2, Users, LayoutList, Share2, Settings, Sparkles } from 'lucide-react';
import type { AcademicProgramme, StudentProject, FacultyMember, PromoSlide, HeroContent, NavItem, FooterContent, FooterLink, SocialLink, SiteSettings, NavSectionId, EventAnnouncement } from '../../types';
import { ImageUploader } from './ImageUploader';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { logout, isAdminLoggedIn } = useAuth();
  const {
    programmes,
    projects,
    faculty,
    promoSlides,
    heroContent,
    navItems,
    footerContent,
    footerLinks,
    socialLinks,
    siteSettings,
    eventAnnouncement,
    refreshData
  } = useData();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'hero' | 'navigation' | 'programmes' | 'projects' | 'faculty' | 'event' | 'footer' | 'social' | 'settings'>('overview');
  const [notice, setNotice] = useState<string | null>(null);

  const { login } = useAuth();

  // Form Editing States for all CMS Modules
  const [editingProg, setEditingProg] = useState<Partial<AcademicProgramme> | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<StudentProject> | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Partial<FacultyMember> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<PromoSlide> | null>(null);
  const [editingHero, setEditingHero] = useState<Partial<HeroContent> | null>(null);
  const [editingNavItem, setEditingNavItem] = useState<Partial<NavItem> | null>(null);
  const [editingFooterContent, setEditingFooterContent] = useState<Partial<FooterContent> | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<Partial<FooterLink> | null>(null);
  const [editingSocialLink, setEditingSocialLink] = useState<Partial<SocialLink> | null>(null);
  const [editingSiteSettings, setEditingSiteSettings] = useState<Partial<SiteSettings> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<EventAnnouncement> | null>(null);

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
  // 2. SAVE & DELETE: STUDENT PROJECTS
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
  // 3. SAVE & DELETE: FACULTY DIRECTORY
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
        name: editingFaculty.name.trim(),
        title: editingFaculty.title.trim(),
        academic_degree: editingFaculty.academicDegree || '',
        office_location: editingFaculty.officeLocation || editingFaculty.office || '',
        email: editingFaculty.email || '',
        phone: editingFaculty.phone || '',
        office_hours: editingFaculty.officeHours || '',
        role: editingFaculty.role || 'Lecturer',
        bio: editingFaculty.bio || editingFaculty.biography || '',
        specialization: editingFaculty.specialization || [],
        qualifications: editingFaculty.qualifications || [],
        teaching_areas: editingFaculty.teachingAreas || [],
        research_interests: editingFaculty.researchInterests || [],
        google_scholar_url: editingFaculty.googleScholarUrl || '',
        orcid_url: editingFaculty.orcidUrl || '',
        linkedin_url: editingFaculty.linkedinUrl || '',
        avatar_url: editingFaculty.avatarUrl || '',
        is_hod: editingFaculty.isHOD || false,
        is_unconfirmed_hod: editingFaculty.isUnconfirmedHOD || false,
        display_order: editingFaculty.displayOrder ?? 0,
        is_active: editingFaculty.isActive ?? true
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
  // SAVE: EVENT ANNOUNCEMENT POPUP
  // ==========================================
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventToSave = editingEvent || eventAnnouncement;
    if (!eventToSave?.title) {
      alert('Event Title is required.');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      const payload = {
        id: eventToSave.id || 'isap-forum-2026',
        title: eventToSave.title.trim(),
        description: eventToSave.description || '',
        event_date: eventToSave.eventDate || '',
        event_time: eventToSave.eventTime || '',
        venue: eventToSave.venue || '',
        image_url: eventToSave.imageUrl || '/images/isap_forum_2026.jpg',
        registration_url: eventToSave.registrationUrl || '',
        is_active: eventToSave.isActive ?? true,
        display_order: eventToSave.displayOrder ?? 1
      };

      const { error } = await supabase.from('event_announcements').upsert(payload);
      if (error) {
        alert(`Supabase Save Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingEvent(null);
    showNotification('Event Announcement Popup configuration saved successfully!');
  };

  // ==========================================
  // 4. SAVE & DELETE: ANNOUNCEMENT SLIDER
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
  // 5. SAVE: HERO & BANNER CONTENT
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
  // 6. SAVE & DELETE: NAVIGATION ITEMS
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
  // 7. SAVE: FOOTER CONTENT & LINKS
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
  // 8. SAVE & DELETE: SOCIAL LINKS
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
  // 9. SAVE: SITE SETTINGS & SEO
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
          onClick={() => {
            setActiveTab('event');
            if (!editingEvent) setEditingEvent(eventAnnouncement);
          }}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
            activeTab === 'event' ? 'bg-slate-800 text-[#F2B705] border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#F2B705]" />
          <span>Event Popup</span>
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student Projects</span>
                <span className="text-3xl font-black text-[#00AEEF]">{projects.length}</span>
                <p className="text-[11px] text-slate-400">Verified & sample projects</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Faculty Directory</span>
                <span className="text-3xl font-black text-emerald-400">{faculty.length}</span>
                <p className="text-[11px] text-slate-400">Department lecturers & HOD</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Promo Banners</span>
                <span className="text-3xl font-black text-purple-400">{promoSlides.length}</span>
                <p className="text-[11px] text-slate-400">Homepage slider banners</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
              <h3 className="text-sm font-extrabold text-[#F2B705]">CMS Content Health Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Navigation Menu Links:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{navItems.length} active items</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Footer Quick Links:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{footerLinks.length} active links</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-700 flex justify-between items-center">
                  <span>Social Links Configured:</span>
                  <span className="font-bold font-mono text-[#00AEEF]">{socialLinks.length} platforms</span>
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
            {/* Hero Main Content Form */}
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

              {editingHero ? (
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
                    <label className="block font-bold text-slate-300 mb-1">Subtext / Description</label>
                    <textarea
                      rows={3}
                      value={editingHero.subtext ?? heroContent.subtext}
                      onChange={(e) => setEditingHero({ ...editingHero, subtext: e.target.value })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Primary CTA Label</label>
                      <input
                        type="text"
                        value={editingHero.primaryCtaText ?? heroContent.primaryCtaText}
                        onChange={(e) => setEditingHero({ ...editingHero, primaryCtaText: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Primary CTA Destination</label>
                      <input
                        type="text"
                        value={editingHero.primaryCtaLink ?? heroContent.primaryCtaLink}
                        onChange={(e) => setEditingHero({ ...editingHero, primaryCtaLink: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUploader
                      label="Homepage Hero Image / Banner Illustration"
                      folder="hero"
                      value={editingHero.imageUrl ?? heroContent.imageUrl ?? ''}
                      onChange={(url) => setEditingHero({ ...editingHero, imageUrl: url })}
                      aspectHint="High resolution hero image"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold text-xs">Save Hero</button>
                    <button type="button" onClick={() => setEditingHero(null)} className="px-4 py-2 rounded bg-slate-700 font-bold text-xs">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-slate-400">Top Line:</strong> {heroContent.topLine}</p>
                  <p><strong className="text-slate-400">Headline:</strong> <span className="font-extrabold text-white">{heroContent.headline}</span></p>
                  <p><strong className="text-slate-400">Subtext:</strong> {heroContent.subtext}</p>
                  <p><strong className="text-slate-400">Primary CTA:</strong> {heroContent.primaryCtaText} ({heroContent.primaryCtaLink})</p>
                </div>
              )}
            </div>

            {/* Promo Banners Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white">Homepage Promotional Banners ({promoSlides.length})</h3>
                <button
                  onClick={() => setEditingSlide({ title: '', imageUrl: '', ctaText: 'Learn More', ctaLink: 'academics' })}
                  className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Banner Slide</span>
                </button>
              </div>

              {editingSlide && (
                <form onSubmit={handleSaveSlide} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-[#F2B705]">{editingSlide.id ? 'Edit Banner Slide' : 'New Banner Entry'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Banner Title *</label>
                      <input
                        type="text"
                        required
                        value={editingSlide.title || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploader
                        label="Promotional Banner Image"
                        folder="promo-slides"
                        value={editingSlide.imageUrl || ''}
                        onChange={(url) => setEditingSlide({ ...editingSlide, imageUrl: url })}
                        aspectHint="Wide banner image"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold text-xs">Save Banner</button>
                    <button type="button" onClick={() => setEditingSlide(null)} className="px-4 py-2 rounded bg-slate-700 font-bold text-xs">Cancel</button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 font-bold uppercase border-b border-slate-700">
                    <tr>
                      <th className="p-3">Title</th>
                      <th className="p-3">Badge</th>
                      <th className="p-3">CTA Link</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {promoSlides.map((slide) => (
                      <tr key={slide.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">{slide.title}</td>
                        <td className="p-3">{slide.badgeText || '—'}</td>
                        <td className="p-3 font-mono">{slide.ctaLink}</td>
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
              <h2 className="text-base font-extrabold text-white">Navbar Menu Configuration</h2>
              <button
                onClick={() => setEditingNavItem({ label: '', sectionId: 'home', displayOrder: navItems.length + 1, isActive: true })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Nav Item</span>
              </button>
            </div>

            {editingNavItem && (
              <form onSubmit={handleSaveNavItem} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingNavItem.id ? 'Edit Nav Item' : 'New Nav Item Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Label *</label>
                    <input
                      type="text"
                      required
                      value={editingNavItem.label || ''}
                      onChange={(e) => setEditingNavItem({ ...editingNavItem, label: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Section ID *</label>
                    <select
                      value={editingNavItem.sectionId || 'home'}
                      onChange={(e) => setEditingNavItem({ ...editingNavItem, sectionId: e.target.value as NavSectionId })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    >
                      <option value="home">home</option>
                      <option value="about">about</option>
                      <option value="academics">academics</option>
                      <option value="faculty">faculty</option>
                      <option value="hub">hub</option>
                      <option value="innovation">innovation</option>
                      <option value="community">community</option>
                      <option value="contact">contact</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingNavItem.displayOrder ?? 0}
                      onChange={(e) => setEditingNavItem({ ...editingNavItem, displayOrder: parseInt(e.target.value) || 0 })}
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
                      <td className="p-3 font-mono text-[#F2B705] font-bold">{item.displayOrder}</td>
                      <td className="p-3 font-bold text-white">{item.label}</td>
                      <td className="p-3 font-mono">{item.sectionId}</td>
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

        {/* TAB 4: ACADEMIC PROGRAMMES */}
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
                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="Programme Illustration / Banner Image"
                      folder="programmes"
                      value={editingProg.imageUrl || ''}
                      onChange={(url) => setEditingProg({ ...editingProg, imageUrl: url })}
                      aspectHint="Card cover or illustration"
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
                  <div className="sm:col-span-2">
                    <ImageUploader
                      label="Project Cover / Screenshot Image"
                      folder="projects"
                      value={editingProj.imageUrl || ''}
                      onChange={(url) => setEditingProj({ ...editingProj, imageUrl: url })}
                      aspectHint="16:9 thumbnail or screenshot"
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
              <h2 className="text-base font-extrabold text-white">Faculty & Leadership Directory</h2>
              <button
                onClick={() => setEditingFaculty({ name: '', title: '' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            {editingFaculty && (
              <form onSubmit={handleSaveFaculty} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingFaculty.id ? 'Edit Faculty Member' : 'New Faculty Member Entry'}</h3>
                
                {/* Name & Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. John Mensah"
                      value={editingFaculty.name || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Designation / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Lecturer"
                      value={editingFaculty.title || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, title: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Academic Degree & Position/Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Academic Degree</label>
                    <input
                      type="text"
                      placeholder="e.g. Ph.D. in Computer Science"
                      value={editingFaculty.academicDegree || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, academicDegree: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Lecturer / Researcher"
                      value={editingFaculty.role || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, role: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Contact: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. lecturer@upsa.edu.gh"
                      value={editingFaculty.email || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, email: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +233 20 000 0000"
                      value={editingFaculty.phone || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, phone: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Office Location & Office Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Office Location</label>
                    <input
                      type="text"
                      placeholder="e.g. IT Block, Room 204"
                      value={editingFaculty.officeLocation || editingFaculty.office || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, officeLocation: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Office Hours</label>
                    <input
                      type="text"
                      placeholder="e.g. Mon & Wed 2pm - 4pm"
                      value={editingFaculty.officeHours || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, officeHours: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Avatar Photo Uploader */}
                <div>
                  <ImageUploader
                    label="Faculty Profile Photo"
                    folder="faculty"
                    value={editingFaculty.avatarUrl || ''}
                    onChange={(url) => setEditingFaculty({ ...editingFaculty, avatarUrl: url })}
                    aspectHint="Square photo recommended"
                  />
                </div>

                {/* Biography */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Biography & Background</label>
                  <textarea
                    rows={3}
                    placeholder="Short professional biography..."
                    value={editingFaculty.bio || editingFaculty.biography || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, bio: e.target.value, biography: e.target.value })}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                {/* Specializations & Research Interests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Specializations (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Artificial Intelligence, Data Analytics"
                      value={Array.isArray(editingFaculty.specialization) ? editingFaculty.specialization.join(', ') : editingFaculty.specialization || ''}
                      onChange={(e) => setEditingFaculty({
                        ...editingFaculty,
                        specialization: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Research Interests (comma separated)</label>
                    <input
                      type="text"
                      placeholder="Machine Learning, Cybersecurity"
                      value={Array.isArray(editingFaculty.researchInterests) ? editingFaculty.researchInterests.join(', ') : editingFaculty.researchInterests || ''}
                      onChange={(e) => setEditingFaculty({
                        ...editingFaculty,
                        researchInterests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Academic Links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Google Scholar URL</label>
                    <input
                      type="text"
                      placeholder="https://scholar.google.com/..."
                      value={editingFaculty.googleScholarUrl || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, googleScholarUrl: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">ORCID URL</label>
                    <input
                      type="text"
                      placeholder="https://orcid.org/..."
                      value={editingFaculty.orcidUrl || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, orcidUrl: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/..."
                      value={editingFaculty.linkedinUrl || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, linkedinUrl: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* HOD Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isHODCheckbox"
                    checked={editingFaculty.isHOD || false}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, isHOD: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-[#003366] focus:ring-[#F2B705]"
                  />
                  <label htmlFor="isHODCheckbox" className="font-bold text-[#F2B705]">Designate as Head of Department (HOD)</label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 font-bold text-white">Save Faculty Profile</button>
                  <button type="button" onClick={() => setEditingFaculty(null)} className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 font-bold text-white">Cancel</button>
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

        {/* TAB: EVENT ANNOUNCEMENT POPUP */}
        {activeTab === 'event' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#F2B705]" />
                  <span>Automatic Event Announcement Popup</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure the automatic pop-up announcement modal that displays to homepage visitors.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-5 text-xs">
              
              {/* Active Toggle */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-white text-sm block">Enable Automatic Event Popup</span>
                  <span className="text-slate-400 text-xs">When enabled, visitors entering #/ will see this announcement.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(editingEvent?.isActive ?? eventAnnouncement.isActive) ?? true}
                    onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Image Uploader for Poster */}
              <ImageUploader
                label="Event Poster Image"
                folder="general"
                value={(editingEvent?.imageUrl ?? eventAnnouncement.imageUrl) || '/images/isap_forum_2026.jpg'}
                onChange={(url) => setEditingEvent({ ...(editingEvent || eventAnnouncement), imageUrl: url })}
                aspectHint="Official event poster graphic"
              />

              {/* Event Title & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ISAP Forum 2026"
                    value={editingEvent?.title ?? eventAnnouncement.title ?? ''}
                    onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), title: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Event Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Wednesday, 7th October 2026"
                    value={editingEvent?.eventDate ?? eventAnnouncement.eventDate ?? ''}
                    onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), eventDate: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              {/* Event Time & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Event Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 9:00 AM GMT"
                    value={editingEvent?.eventTime ?? eventAnnouncement.eventTime ?? ''}
                    onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), eventTime: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g. PCU Auditorium (Second Floor), UPSA"
                    value={editingEvent?.venue ?? eventAnnouncement.venue ?? ''}
                    onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), venue: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              {/* Description / Theme */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Event Theme / Description</label>
                <textarea
                  rows={3}
                  placeholder="Theme and summary of event..."
                  value={editingEvent?.description ?? eventAnnouncement.description ?? ''}
                  onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), description: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              {/* Registration / External Link */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Registration / External URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://forms.gle/..."
                  value={editingEvent?.registrationUrl ?? eventAnnouncement.registrationUrl ?? ''}
                  onChange={(e) => setEditingEvent({ ...(editingEvent || eventAnnouncement), registrationUrl: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 font-extrabold text-white text-xs tracking-wider uppercase shadow-md transition-colors"
                >
                  Save Event Announcement Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: FOOTER & LINKS */}
        {activeTab === 'footer' && (
          <div className="space-y-8">
            {/* Footer Branding Form */}
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

              {editingFooterContent ? (
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

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Description Paragraph</label>
                    <textarea
                      rows={2}
                      value={editingFooterContent.description ?? footerContent.description}
                      onChange={(e) => setEditingFooterContent({ ...editingFooterContent, description: e.target.value })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Digital Address</label>
                      <input
                        type="text"
                        value={editingFooterContent.digitalAddress ?? footerContent.digitalAddress}
                        onChange={(e) => setEditingFooterContent({ ...editingFooterContent, digitalAddress: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Admissions Phone</label>
                      <input
                        type="text"
                        value={editingFooterContent.phoneAdmissions ?? footerContent.phoneAdmissions}
                        onChange={(e) => setEditingFooterContent({ ...editingFooterContent, phoneAdmissions: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                      <input
                        type="email"
                        value={editingFooterContent.email ?? footerContent.email}
                        onChange={(e) => setEditingFooterContent({ ...editingFooterContent, email: e.target.value })}
                        className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Footer</button>
                    <button type="button" onClick={() => setEditingFooterContent(null)} className="px-4 py-2 rounded bg-slate-700 font-bold">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1 text-slate-300">
                  <p><strong className="text-slate-400">Logo:</strong> {footerContent.logoText} | <strong className="text-slate-400">Motto:</strong> {footerContent.mottoText}</p>
                  <p><strong className="text-slate-400">Digital Address:</strong> {footerContent.digitalAddress} | <strong className="text-slate-400">Email:</strong> {footerContent.email}</p>
                </div>
              )}
            </div>

            {/* Footer Links Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white">Footer Quick Links ({footerLinks.length})</h3>
                <button
                  onClick={() => setEditingFooterLink({ columnTitle: 'ACADEMICS & HUB', label: '', url: 'academics', isExternal: false, displayOrder: footerLinks.length + 1 })}
                  className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Footer Link</span>
                </button>
              </div>

              {editingFooterLink && (
                <form onSubmit={handleSaveFooterLink} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                  <h4 className="font-bold text-[#F2B705]">{editingFooterLink.id ? 'Edit Footer Link' : 'New Footer Link Entry'}</h4>
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
                      <label className="block font-bold text-slate-300 mb-1">URL / Section ID *</label>
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
                    {footerLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-[#F2B705]">{link.columnTitle}</td>
                        <td className="p-3 font-bold text-white">{link.label}</td>
                        <td className="p-3 font-mono">{link.url}</td>
                        <td className="p-3 text-right space-x-2">
                          <button onClick={() => setEditingFooterLink(link)} className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"><Edit className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeleteFooterLink(link.id)} className="p-1.5 rounded bg-red-600/80 hover:bg-red-600 text-white"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SOCIAL LINKS */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Social Media Platforms</h2>
              <button
                onClick={() => setEditingSocialLink({ platform: 'Facebook', url: 'https://', displayOrder: socialLinks.length + 1 })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Platform</span>
              </button>
            </div>

            {editingSocialLink && (
              <form onSubmit={handleSaveSocialLink} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
                <h3 className="font-bold text-[#F2B705]">{editingSocialLink.id ? 'Edit Social Link' : 'New Social Entry'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Platform Name *</label>
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
                      type="url"
                      required
                      value={editingSocialLink.url || ''}
                      onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })}
                      className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-2 rounded bg-emerald-600 font-bold">Save Social Link</button>
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
                      <td className="p-3 font-mono text-[#00AEEF]">{s.url}</td>
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

        {/* TAB 9: SITE SETTINGS & SEO */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-base font-extrabold text-white">Site Configuration & SEO Metadata</h2>

            <form onSubmit={handleSaveSiteSettings} className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Web Portal Title *</label>
                <input
                  type="text"
                  required
                  value={editingSiteSettings?.siteTitle ?? siteSettings.siteTitle}
                  onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, siteTitle: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={editingSiteSettings?.metaDescription ?? siteSettings.metaDescription}
                  onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, metaDescription: e.target.value })}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={editingSiteSettings?.organizationName ?? siteSettings.organizationName}
                    onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, organizationName: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Canonical URL</label>
                  <input
                    type="url"
                    value={editingSiteSettings?.canonicalUrl ?? siteSettings.canonicalUrl}
                    onChange={(e) => setEditingSiteSettings({ ...editingSiteSettings, canonicalUrl: e.target.value })}
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <ImageUploader
                  label="OpenGraph Share Image (Social Cards)"
                  folder="general"
                  value={editingSiteSettings?.shareImageUrl ?? siteSettings.shareImageUrl ?? ''}
                  onChange={(url) => setEditingSiteSettings({ ...editingSiteSettings, shareImageUrl: url })}
                  aspectHint="1200x630px social banner image"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="px-5 py-2.5 rounded bg-emerald-600 font-extrabold text-white text-xs tracking-wider uppercase">
                  Save Site Settings
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
