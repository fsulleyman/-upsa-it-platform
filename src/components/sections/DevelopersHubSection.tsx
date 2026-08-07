import React from 'react';
import type { HubMilestone } from '../../types';

interface DevelopersHubSectionProps {
  onOpenJoinModal: () => void;
  hubDetails?: {
    nature: string;
    mission: string;
    milestone: HubMilestone;
  };
}

export const DevelopersHubSection: React.FC<DevelopersHubSectionProps> = ({ onOpenJoinModal, hubDetails }) => {
  const milestone = hubDetails?.milestone || {
    id: "net-infra-2026",
    date: "24–27 March 2026",
    title: "UPSA Live Network Infrastructure Guided Exposure",
    location: "UPSA Data Center & Central Server Room",
    participantsCount: "~400",
    description: "Over 400 Developers Hub members engaged in a hands-on exploration of UPSA's enterprise network infrastructure, guided by the university's IT Services Department."
  };

  const nature = hubDetails?.nature || "Student-led, department-guided, project-based learning community.";

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
            {nature} Anchored in the UPSA Computer Laboratory, the Hub bridges classroom software theory with practical enterprise systems engineering.
          </p>
        </div>

        {/* Highlight Milestone Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl space-y-6 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#00AEEF] uppercase block">
                RECENT MILESTONE ({milestone.date})
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {milestone.title}
              </h3>
            </div>
            <span className="px-4 py-1.5 rounded-full bg-[#003366] text-[#F2B705] font-extrabold font-mono text-sm border border-[#F2B705]">
              {milestone.participantsCount} PARTICIPANTS
            </span>
          </div>

          <p className="body-text text-sm sm:text-base text-slate-300 leading-relaxed">
            {milestone.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400">
              Location: <strong className="text-white">{milestone.location}</strong>
            </span>

            <button
              onClick={onOpenJoinModal}
              className="px-6 py-3 rounded-xl bg-[#F2B705] hover:bg-yellow-400 text-[#003366] font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors"
            >
              Join Developers Hub Cohort
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
