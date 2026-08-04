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
    <section id="academics" className="py-16 bg-[#FFFFFF] border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-end">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="section-heading">
              Degree & Diploma Catalog
            </h2>
            <p className="body-text text-lg text-[#555555]">
              Accredited qualifications offered by the Department of IT Studies combining computer science fundamentals with enterprise IT management.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="inline-flex p-1.5 bg-[#F5F7FA] rounded-lg border border-slate-300 gap-1 flex-wrap">
              {filterTabs.map((tab) => {
                const isActive = selectedLevel === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedLevel(tab)}
                    className={`px-3.5 py-2 rounded-md text-xs font-extrabold tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#003366] text-white shadow-sm'
                        : 'text-[#1A1A1A] hover:text-[#003366]'
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
              className="group p-6 rounded-xl bg-[#F5F7FA] border border-slate-300 hover:border-[#003366] hover:shadow-lg transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Optional Programme Graphic Banner */}
              {prog.imageUrl && (
                <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden bg-white border border-slate-300 shrink-0 shadow-sm relative group-hover:scale-102 transition-transform">
                  <img
                    src={prog.imageUrl}
                    alt={prog.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2.5 flex-1 max-w-3xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 rounded-md bg-[#003366] text-white font-mono text-xs font-bold">
                    {prog.code}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A] bg-white px-3 py-1 rounded border border-slate-300">
                    {prog.level}
                  </span>
                  <span className="text-xs font-semibold text-[#555555]">
                    Duration: {prog.duration}
                  </span>
                  {prog.isNew && (
                    <span className="text-xs font-extrabold text-[#003366] bg-[#F2B705]/20 px-2.5 py-0.5 rounded border border-[#F2B705]">
                      NEW PROGRAMME
                    </span>
                  )}
                </div>

                <h3 className="subheading text-xl sm:text-2xl font-extrabold text-[#1A1A1A] group-hover:text-[#003366] transition-colors">
                  {prog.name}
                </h3>
                <p className="body-text text-sm sm:text-base text-[#555555] leading-relaxed">{prog.description}</p>

                <div className="flex flex-wrap gap-2 pt-1">
                  {prog.skillsDeveloped.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-white text-[#1A1A1A] text-xs font-semibold border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 text-xs font-extrabold text-[#003366] group-hover:text-blue-900 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200">
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
