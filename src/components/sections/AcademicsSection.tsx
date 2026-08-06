import React, { useState } from 'react';
import { PROGRAMMES } from '../../data/groundTruth';
import type { AcademicProgramme } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface AcademicsSectionProps {
  onSelectProgramme: (programme: AcademicProgramme) => void;
}

export const AcademicsSection: React.FC<AcademicsSectionProps> = ({ onSelectProgramme }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filterTabs = ['All', 'Undergraduate', 'Postgraduate', 'Diploma'];

  const filteredProgrammes = PROGRAMMES.filter((p) => {
    if (selectedLevel === 'All') return true;
    return p.level === selectedLevel;
  });

  return (
    <section id="academics" className="py-16 bg-[#0B132B] border-b border-slate-800 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-end">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="section-heading text-white">
              Degree & Diploma Catalog
            </h2>
            <p className="body-text text-lg text-slate-300">
              Accredited qualifications offered by the Department of IT Studies combining computer science fundamentals with enterprise IT management.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="inline-flex p-1.5 bg-[#001B40] rounded-lg border border-slate-800 gap-1 flex-wrap">
              {filterTabs.map((tab) => {
                const isActive = selectedLevel === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedLevel(tab)}
                    className={`px-3.5 py-2 rounded-md text-xs font-extrabold tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Programme Rows with Official Images */}
        <div className="space-y-5">
          {filteredProgrammes.map((prog) => (
            <div
              key={prog.id}
              onClick={() => onSelectProgramme(prog)}
              className="group p-6 rounded-xl bg-[#001B40] border border-slate-800 hover:border-[#F2B705]/60 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Optional Programme Graphic Banner */}
              {prog.imageUrl && (
                <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0 shadow-sm relative group-hover:scale-102 transition-transform">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              )}

              <div className="space-y-2.5 flex-1 max-w-3xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-md bg-[#003366] text-[#F2B705] font-mono text-xs font-bold border border-[#F2B705]/30">
                    {prog.code}
                  </span>
                  <span className="text-xs font-bold text-slate-200 bg-[#0B132B] px-3 py-1 rounded border border-slate-800">
                    {prog.level}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Duration: {prog.duration}
                  </span>
                  {prog.isNew && (
                    <span className="text-xs font-extrabold text-[#F2B705] bg-[#F2B705]/15 px-2.5 py-0.5 rounded border border-[#F2B705]/40">
                      NEW PROGRAMME
                    </span>
                  )}
                </div>

                <h3 className="subheading text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#F2B705] transition-colors">
                  {prog.name}
                </h3>
                <p className="body-text text-sm sm:text-base text-slate-300 leading-relaxed">{prog.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {prog.skillsDeveloped.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#0B132B] text-slate-200 text-xs font-semibold border border-slate-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-extrabold text-[#F2B705] group-hover:text-amber-300 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <span>View Full Curriculum & Entry Requirements</span>
                <ArrowUpRight className="w-4 h-4 text-[#F2B705]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
