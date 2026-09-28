import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useData } from '../../hooks/useData';
import { LogOut, ExternalLink, Plus, Trash2, Edit, Save, ShieldAlert, CheckCircle } from 'lucide-react';
import type { AcademicProgramme, DegreeLevel, StudentProject, FacultyMember, PromoSlide } from '../../types';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { logout, isAdminLoggedIn } = useAuth();
  const { programmes, projects, faculty, promoSlides, refreshData } = useData();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'programmes' | 'projects' | 'faculty' | 'slides'>('programmes');
  const [notice, setNotice] = useState<string | null>(null);

  const { login } = useAuth();

  // Form Editing States for all 4 Modules
  const [editingProg, setEditingProg] = useState<Partial<AcademicProgramme> | null>(null);
  const [editingProj, setEditingProj] = useState<Partial<StudentProject> | null>(null);
  const [editingFaculty, setEditingFaculty] = useState<Partial<FacultyMember> | null>(null);
  const [editingSlide, setEditingSlide] = useState<Partial<PromoSlide> | null>(null);

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
        alert(`Supabase RLS/Save Error: ${error.message}`);
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
        office_location: editingFaculty.officeLocation || '',
        role: editingFaculty.role || 'Lecturer',
        bio: editingFaculty.bio || '',
        specialization: editingFaculty.specialization || [],
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

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Top Header Bar */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#F2B705] animate-pulse" />
          <h1 className="text-lg font-extrabold text-white">UPSA IT Studies — Administrative Control Center</h1>
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

      {/* Navigation Tabs */}
      <div className="px-6 pt-6 flex gap-2 border-b border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs transition-colors ${
            activeTab === 'programmes' ? 'bg-slate-800 text-white border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Academic Programmes ({programmes.length})
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs transition-colors ${
            activeTab === 'projects' ? 'bg-slate-800 text-white border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Student Innovation Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('faculty')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs transition-colors ${
            activeTab === 'faculty' ? 'bg-slate-800 text-white border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Faculty Directory ({faculty.length})
        </button>
        <button
          onClick={() => setActiveTab('slides')}
          className={`px-4 py-2.5 rounded-t-lg font-bold text-xs transition-colors ${
            activeTab === 'slides' ? 'bg-slate-800 text-white border-t-2 border-[#F2B705]' : 'text-slate-400 hover:text-white'
          }`}
        >
          Announcement Slider ({promoSlides.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto">
        
        {/* ==========================================
            TAB 1: ACADEMIC PROGRAMMES
           ========================================== */}
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
              <form onSubmit={handleSaveProgramme} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-[#F2B705]">
                  {editingProg.id ? 'Edit Programme' : 'New Programme Entry'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Programme Code *</label>
                    <input
                      type="text"
                      required
                      value={editingProg.code || ''}
                      onChange={(e) => setEditingProg({ ...editingProg, code: e.target.value })}
                      placeholder="e.g. BSc ITM"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingProg.name || ''}
                      onChange={(e) => setEditingProg({ ...editingProg, name: e.target.value })}
                      placeholder="e.g. BSc Information Technology Management"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Academic Level</label>
                    <select
                      value={editingProg.level || 'Undergraduate'}
                      onChange={(e) => setEditingProg({ ...editingProg, level: e.target.value as DegreeLevel })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Diploma">Diploma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingProg.duration || ''}
                      onChange={(e) => setEditingProg({ ...editingProg, duration: e.target.value })}
                      placeholder="e.g. 4 Years"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingProg.tagline || ''}
                    onChange={(e) => setEditingProg({ ...editingProg, tagline: e.target.value })}
                    placeholder="Short summary tagline..."
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProg(null)}
                    className="px-4 py-2 rounded bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#003366] text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes Live</span>
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Programme Name</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {programmes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-[#F2B705]">{p.code}</td>
                      <td className="p-3 font-bold text-white">{p.name}</td>
                      <td className="p-3">{p.level}</td>
                      <td className="p-3">{p.duration}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProg(p)}
                          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgramme(p.id)}
                          className="p-1.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: STUDENT INNOVATION PROJECTS
           ========================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Student Innovation Projects</h2>
              <button
                onClick={() => setEditingProj({ title: '', studentName: '', category: 'Web Development', isVerifiedReal: true })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {editingProj && (
              <form onSubmit={handleSaveProject} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-[#F2B705]">
                  {editingProj.id ? 'Edit Project' : 'New Project Entry'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProj.title || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                      placeholder="e.g. BloodVault"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Student Lead / Team *</label>
                    <input
                      type="text"
                      required
                      value={editingProj.studentName || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, studentName: e.target.value })}
                      placeholder="e.g. Baffour Akoto Aninfeng"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category</label>
                    <select
                      value={editingProj.category || 'Web Development'}
                      onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value as any })}
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Applications">Mobile Applications</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Information Systems">Information Systems</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                    <input
                      type="text"
                      value={editingProj.imageUrl || ''}
                      onChange={(e) => setEditingProj({ ...editingProj, imageUrl: e.target.value })}
                      placeholder="/images/bloodvault_preview.jpg"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingProj.description || ''}
                    onChange={(e) => setEditingProj({ ...editingProj, description: e.target.value })}
                    placeholder="Short description of the system..."
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProj(null)}
                    className="px-4 py-2 rounded bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#003366] text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Project Live</span>
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Student Lead</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {projects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{p.title}</td>
                      <td className="p-3 font-mono text-[#F2B705]">{p.category}</td>
                      <td className="p-3">{p.studentName}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setEditingProj(p)}
                          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 3: FACULTY DIRECTORY
           ========================================== */}
        {activeTab === 'faculty' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Faculty & Department Leadership Directory</h2>
              <button
                onClick={() => setEditingFaculty({ name: '', title: '', academicDegree: 'PhD', role: 'Lecturer' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Member</span>
              </button>
            </div>

            {editingFaculty && (
              <form onSubmit={handleSaveFaculty} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-[#F2B705]">
                  {editingFaculty.id ? 'Edit Faculty Record' : 'New Faculty Member'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.name || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                      placeholder="e.g. Dr. Joshua Kwaku Ofoeda"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Title / Position *</label>
                    <input
                      type="text"
                      required
                      value={editingFaculty.title || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, title: e.target.value })}
                      placeholder="e.g. Head of Department, IT Studies"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Academic Degree</label>
                    <input
                      type="text"
                      value={editingFaculty.academicDegree || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, academicDegree: e.target.value })}
                      placeholder="e.g. PhD (Information Systems)"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Avatar / Photo URL</label>
                    <input
                      type="text"
                      value={editingFaculty.avatarUrl || ''}
                      onChange={(e) => setEditingFaculty({ ...editingFaculty, avatarUrl: e.target.value })}
                      placeholder="/images/dr_joshua_ofoeda.png"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Biography</label>
                  <textarea
                    rows={2}
                    value={editingFaculty.bio || ''}
                    onChange={(e) => setEditingFaculty({ ...editingFaculty, bio: e.target.value })}
                    placeholder="Short academic bio..."
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingFaculty(null)}
                    className="px-4 py-2 rounded bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#003366] text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Faculty Record Live</span>
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Degree</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {faculty.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{f.name}</td>
                      <td className="p-3 font-semibold text-[#F2B705]">{f.title}</td>
                      <td className="p-3 font-mono">{f.academicDegree}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setEditingFaculty(f)}
                          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaculty(f.id)}
                          className="p-1.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: ANNOUNCEMENT SLIDER
           ========================================== */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-extrabold text-white">Announcement Banners & Hero Slider</h2>
              <button
                onClick={() => setEditingSlide({ title: '', badgeText: 'DEPARTMENT ANNOUNCEMENT', ctaText: 'Explore Programmes', ctaLink: 'academics', imageUrl: '/images/upsa_congregation_2026.png' })}
                className="px-3.5 py-2 rounded-lg bg-[#003366] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Announcement Slide</span>
              </button>
            </div>

            {editingSlide && (
              <form onSubmit={handleSaveSlide} className="p-5 rounded-xl bg-slate-800 border border-slate-700 space-y-4">
                <h3 className="text-sm font-bold text-[#F2B705]">
                  {editingSlide.id ? 'Edit Slide' : 'New Announcement Slide'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={editingSlide.badgeText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                      placeholder="e.g. 14TH CONGREGATION CEREMONY"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Slide Title *</label>
                    <input
                      type="text"
                      required
                      value={editingSlide.title || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      placeholder="e.g. 2026 Graduating Class"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Banner Image URL *</label>
                    <input
                      type="text"
                      required
                      value={editingSlide.imageUrl || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      placeholder="/images/upsa_congregation_2026.png"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={editingSlide.ctaText || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                      placeholder="e.g. Explore Programmes"
                      className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Subtext / Description</label>
                  <textarea
                    rows={2}
                    value={editingSlide.subtext || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtext: e.target.value })}
                    placeholder="Short banner description..."
                    className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(null)}
                    className="px-4 py-2 rounded bg-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#003366] text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Slide Live</span>
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-800/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">Badge</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">CTA Link</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {promoSlides.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-[#F2B705]">{s.badgeText || 'ANNOUNCEMENT'}</td>
                      <td className="p-3 font-bold text-white">{s.title}</td>
                      <td className="p-3 font-mono">{s.ctaLink || 'academics'}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <button
                          onClick={() => setEditingSlide(s)}
                          className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 text-white"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(s.id)}
                          className="p-1.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
