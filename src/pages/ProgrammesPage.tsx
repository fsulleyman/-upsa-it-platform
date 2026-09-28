import React, { useState } from 'react';
import type { AcademicProgramme, NavSectionId } from '../types';
import { GraduationCap, Search, ChevronRight } from 'lucide-react';

interface ProgrammesPageProps {
  programmes: AcademicProgramme[];
  onNavigate?: (section: NavSectionId) => void;
  onSelectProgramme: (prog: AcademicProgramme) => void;
}

export const ProgrammesPage: React.FC<ProgrammesPageProps> = ({
  programmes,
  onSelectProgramme
}) => {
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProgrammes = programmes.filter((prog) => {
    const matchesLevel = levelFilter === 'All' || prog.level.toLowerCase() === levelFilter.toLowerCase();
    const matchesSearch =
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Programmes Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Degree & Qualification Directory</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Full list of undergraduate, postgraduate, and diploma degrees offered by the Department of Information Technology Studies.
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Level Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'Undergraduate', 'Postgraduate', 'Diploma'].map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors ${
                  levelFilter === level
                    ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/50'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Programme List Grid */}
        {filteredProgrammes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProgrammes.map((prog) => (
              <div
                key={prog.id}
                onClick={() => onSelectProgramme(prog)}
                className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded bg-[#003366] text-white font-mono text-xs font-bold">
                      {prog.code}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
                      {prog.level}
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#1A1A1A] leading-snug">{prog.name}</h2>
                  <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">{prog.description}</p>

                  {/* Key Skills Tags */}
                  {prog.skillsDeveloped && prog.skillsDeveloped.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {prog.skillsDeveloped.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-[#003366]/10 text-[#003366] px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#003366]">
                  <span>Duration: {prog.duration}</span>
                  <span className="flex items-center gap-1 hover:underline">
                    View Full Details <ChevronRight className="w-4 h-4 text-[#F2B705]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
            <h3 className="text-lg font-bold text-[#1A1A1A]">No matching programmes found</h3>
            <p className="text-xs text-slate-500">Try clearing search filters or level selection.</p>
          </div>
        )}
      </section>
    </div>
  );
};
