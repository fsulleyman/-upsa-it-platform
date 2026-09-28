import React, { useState } from 'react';
import type { ResearchProject, FacultyPublication, FacultyMember, NavSectionId } from '../types';
import { FlaskConical, FileText, Search } from 'lucide-react';

interface ResearchPageProps {
  researchProjects: ResearchProject[];
  publications: FacultyPublication[];
  faculty: FacultyMember[];
  onNavigate?: (section: NavSectionId) => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({
  researchProjects,
  publications,
  faculty
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'publications'>('projects');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = researchProjects.filter(
    (rp) =>
      rp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rp.researchArea.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pub.journalOrVenue && pub.journalOrVenue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pub.journal && pub.journal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pub.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <FlaskConical className="w-4 h-4" />
            <span>Applied Engineering & Academic Research</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Research & Publications Repository</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Investigating artificial intelligence diagnostics, cybersecurity threat models, IT governance frameworks, and data science analytics.
          </p>
        </div>
      </section>

      {/* Tab Switcher & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
                activeTab === 'projects'
                  ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/50'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Research Projects ({researchProjects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('publications')}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
                activeTab === 'publications'
                  ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/50'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Faculty Publications ({publications.length})</span>
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research or publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Tab 1: Research Projects */}
        {activeTab === 'projects' && (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((rp) => {
                const lead = faculty.find((f) => f.id === rp.leadFacultyId);
                return (
                  <div
                    key={rp.id}
                    className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded bg-[#003366]/10 text-[#003366] font-bold text-xs">
                          {rp.researchArea}
                        </span>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                          {rp.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-[#1A1A1A] leading-snug">{rp.title}</h3>
                      <p className="text-xs text-[#555555] leading-relaxed">{rp.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-bold text-[#003366]">Lead: {lead ? lead.name : rp.leadFacultyName || rp.leadResearcher || 'IT Faculty Team'}</span>
                      {rp.startDate && <span className="font-mono text-slate-500">{rp.startDate}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Research information is currently being updated.</h3>
              <p className="text-xs text-slate-500">No matching research projects found.</p>
            </div>
          )
        )}

        {/* Tab 2: Publications Library */}
        {activeTab === 'publications' && (
          filteredPublications.length > 0 ? (
            <div className="space-y-4">
              {filteredPublications.map((pub) => (
                <div key={pub.id} className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-md transition-all space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">{pub.publicationType || 'Peer-Reviewed Journal'}</span>
                    <span className="font-mono font-bold text-[#003366]">{pub.publicationYear}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A]">{pub.title}</h3>
                  <p className="text-xs font-semibold text-[#003366]">{pub.journalOrVenue || pub.journal}</p>
                  <p className="text-xs text-slate-600 font-mono">Authors: {pub.authors.join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Publication library is currently being updated.</h3>
              <p className="text-xs text-slate-500">No matching faculty publications found.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
};
