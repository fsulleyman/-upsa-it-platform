import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useData } from '../../hooks/useData';
import { LogOut, ExternalLink, Plus, Trash2, Edit, Save, ShieldAlert, CheckCircle } from 'lucide-react';
import type { AcademicProgramme, DegreeLevel } from '../../types';

export const AdminDashboard: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { logout, isAdminLoggedIn } = useAuth();
  const { programmes, projects, faculty, promoSlides, refreshData } = useData();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'programmes' | 'projects' | 'faculty' | 'slides'>('programmes');
  const [notice, setNotice] = useState<string | null>(null);

  const { login } = useAuth();

  // Form Editing States
  const [editingProg, setEditingProg] = useState<Partial<AcademicProgramme> | null>(null);

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

  // --- SAVE PROGRAMME ---
  const handleSaveProgramme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProg?.name || !editingProg?.code) {
      alert('Programme Name and Code are required.');
      return;
    }
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('programmes').upsert({
        id: editingProg.id || editingProg.code.toLowerCase().replace(/\s+/g, '-'),
        code: editingProg.code,
        name: editingProg.name,
        level: editingProg.level || 'Undergraduate',
        duration: editingProg.duration || '4 Years',
        tagline: editingProg.tagline || '',
        description: editingProg.description || '',
        image_url: editingProg.imageUrl || ''
      });
      if (error) {
        alert(`Supabase RLS Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    setEditingProg(null);
    showNotification('Programme saved successfully! Changes are live on the public site.');
  };

  // --- DELETE PROGRAMME ---
  const handleDeleteProgramme = async (id: string) => {
    if (!confirm('Are you sure you want to delete this programme? This action live-updates the public site.')) return;
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('programmes').delete().eq('id', id);
      if (error) {
        alert(`Supabase RLS Error: ${error.message}`);
        return;
      }
    }
    refreshData();
    showNotification('Programme deleted.');
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
        
        {/* PROGRAMMES MANAGER */}
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

      </div>
    </div>
  );
};
