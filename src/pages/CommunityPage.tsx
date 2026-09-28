import React from 'react';
import type { NavSectionId } from '../types';
import { CommunitySection } from '../components/sections/CommunitySection';
import { Users2 } from 'lucide-react';

interface CommunityPageProps {
  onNavigate?: (section: NavSectionId) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F2B705] text-xs font-mono font-semibold">
            <Users2 className="w-3.5 h-3.5" />
            <span>STUDENT LIFE & CLUBS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            IT Department Community
          </h1>
          <p className="text-slate-200 text-sm max-w-3xl leading-relaxed">
            Join vibrant student organizations, coding hackathons, peer mentoring networks, and industry tech bootcamps at UPSA.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommunitySection />
      </div>
    </div>
  );
};
