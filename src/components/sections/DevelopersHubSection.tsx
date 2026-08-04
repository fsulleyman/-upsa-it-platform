import React from 'react';
import { HUB_DETAILS } from '../../data/groundTruth';

interface DevelopersHubSectionProps {
  onOpenJoinModal: () => void;
}

export const DevelopersHubSection: React.FC<DevelopersHubSectionProps> = ({ onOpenJoinModal }) => {
  const milestone = HUB_DETAILS.milestone;

  return (
    <section id="hub" className="dark-section py-16 bg-[#003366] text-white border-b-4 border-[#F2B705] relative w-full max-w-full overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="max-w-3xl mb-10 space-y-3">
          <span className="text-xs font-mono font-bold text-[#F2B705] uppercase tracking-wider block">
            DEPARTMENT FLAGSHIP INITIATIVE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            UPSA Developers Hub
          </h2>
          <p className="body-text text-lg text-slate-200 leading-relaxed">
            {HUB_DETAILS.nature} Anchored in the UPSA Computer Laboratory, the Hub bridges classroom software theory with practical enterprise systems engineering.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Main Hub Brief */}
          <div className="dark-card lg:col-span-7 p-8 rounded-xl bg-[#002244] border border-blue-900 shadow-lg space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#F2B705]">
                <span className="font-mono font-bold">ESTABLISHED 17 DECEMBER 2025</span>
                <span>UPSA Computer Lab</span>
              </div>
              <h3 className="subheading text-2xl font-extrabold text-white">
                Project-Based Systems Engineering
              </h3>
              <p className="body-text text-sm sm:text-base text-slate-200 leading-relaxed">
                {HUB_DETAILS.mission} Open to IT Studies students and selected cross-programme peers with demonstrated aptitude for software architecture and data engineering.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-950">
              <div className="p-4 rounded-lg bg-[#001B40] border border-blue-900">
                <div className="text-white font-extrabold text-base">Practice Cohorts</div>
                <div className="small-text text-slate-300">Continuous code triage</div>
              </div>
              <div className="p-4 rounded-lg bg-[#001B40] border border-blue-900">
                <div className="text-[#00AEEF] font-extrabold text-base">Faculty Guidance</div>
                <div className="small-text text-slate-300">Direct academic review</div>
              </div>
            </div>
          </div>

          {/* Mentorship Spotlight */}
          <div className="dark-card lg:col-span-5 p-8 rounded-xl bg-[#002244] border-2 border-[#F2B705] shadow-lg space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#F2B705] uppercase tracking-wider block">
                FACULTY MENTOR
              </span>
              <div>
                <h4 className="subheading text-2xl font-extrabold text-white">{HUB_DETAILS.facultyMentor.name}</h4>
                <p className="small-text text-slate-300 mt-0.5">{HUB_DETAILS.facultyMentor.degree}</p>
              </div>
              <p className="body-text text-sm sm:text-base text-slate-200 leading-relaxed">
                {HUB_DETAILS.facultyMentor.role}. Guiding students in software engineering standards, open-source project management, and collaborative hackathons.
              </p>
            </div>

            <div className="pt-4 border-t border-blue-950">
              <button
                onClick={onOpenJoinModal}
                className="w-full py-3 rounded-lg bg-[#F2B705] text-[#003366] font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 shadow-md transition-all text-center border border-[#003366]/30"
              >
                Apply to Join Developers Hub
              </button>
            </div>
          </div>

        </div>

        {/* Milestone Showcase Box with Color Pop Emphasis Numbers */}
        <div className="dark-card p-8 rounded-xl bg-[#002244] border border-blue-900 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-950">
            <div>
              <span className="small-text font-mono font-bold text-[#00AEEF] uppercase tracking-wider block mb-1">
                VERIFIED MILESTONE
              </span>
              <h3 className="subheading text-xl sm:text-2xl font-extrabold text-white">{milestone.title}</h3>
              <p className="small-text text-slate-300 mt-0.5">Date: {milestone.date} • Venue: {milestone.location}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#001B40] text-center shrink-0 border-2 border-[#F2B705]">
              <div className="stat-number text-[#F2B705] text-3xl font-black">{milestone.participantsCount}</div>
              <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">Students Exposed</div>
            </div>
          </div>

          <p className="body-text text-sm sm:text-base text-slate-200 leading-relaxed">
            {milestone.description}
          </p>
        </div>

      </div>
    </section>
  );
};
