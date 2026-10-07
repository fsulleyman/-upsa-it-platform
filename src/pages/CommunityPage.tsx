import React from 'react';
import type { NavSectionId } from '../types';
import { CommunitySection } from '../components/sections/CommunitySection';
import { Users, ArrowLeft } from 'lucide-react';

interface CommunityPageProps {
  onNavigate: (section: NavSectionId) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              <Users className="w-4 h-4" />
              <span>DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES</span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Page</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Community & Professional Growth</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Connecting IT Studies students with industry learning platforms, executive master classes, and professional technical networks.
          </p>
        </div>
      </section>

      {/* Main Community Section Content */}
      <CommunitySection />
    </div>
  );
};
