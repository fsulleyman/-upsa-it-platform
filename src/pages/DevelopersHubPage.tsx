import React from 'react';
import type { NavSectionId } from '../types';
import { DevelopersHubSection } from '../components/sections/DevelopersHubSection';
import { Terminal } from 'lucide-react';

interface DevelopersHubPageProps {
  hubDetails: any;
  onNavigate?: (section: NavSectionId) => void;
  onOpenJoinModal: () => void;
}

export const DevelopersHubPage: React.FC<DevelopersHubPageProps> = ({
  hubDetails,
  onOpenJoinModal
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider font-mono">
            <Terminal className="w-4 h-4" />
            <span>EST. 17 DECEMBER 2025 • UPSA COMPUTER LABORATORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">UPSA IT Developers Hub</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            The premier software development and technology incubator of the University of Professional Studies, Accra — empowering student developers through hands-on code labs, industry mentoring, and software engineering production.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DevelopersHubSection hubDetails={hubDetails} onOpenJoinModal={onOpenJoinModal} />
      </div>
    </div>
  );
};
