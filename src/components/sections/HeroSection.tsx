import React from 'react';
import type { NavSectionId } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: NavSectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full max-w-full overflow-hidden pt-10 pb-16 bg-[#0B132B] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Line */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#F2B705] uppercase tracking-wider mb-5 flex-wrap">
          <span>UPSA ACCRA</span>
          <span>•</span>
          <span className="text-slate-300">FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES</span>
          <span>•</span>
          <span className="text-[#00AEEF]">EST. 1965</span>
        </div>

        {/* Hero Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* JOMACS-Grade Confident Hero Headline */}
            <h1 className="hero-heading text-white">
              Department of Information Technology Studies
            </h1>

            {/* Hero Subtext */}
            <p className="hero-subtext max-w-2xl text-slate-200">
              University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('academics')}
                className="px-6 py-3.5 rounded-lg bg-[#003366] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:bg-blue-900 border border-[#F2B705] transition-all flex items-center gap-2 group"
              >
                <span>Explore Academic Programmes</span>
                <ArrowRight className="w-4 h-4 text-[#F2B705] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('innovation')}
                className="px-5 py-3.5 rounded-lg bg-[#001B40] border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                <span>Inspect Student Systems & Code</span>
              </button>
            </div>
          </div>

          {/* Right Column: Developers Hub Brief Info Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-xl bg-[#001B40] border border-slate-800 shadow-xl space-y-4">
              
              <div className="pb-3 border-b border-slate-800 flex justify-between items-center">
                <h2 className="subheading font-extrabold text-[#F2B705]">
                  UPSA Developers Hub
                </h2>
                <span className="text-xs font-bold text-slate-400">Est. 17 Dec 2025</span>
              </div>

              <p className="body-text text-sm text-slate-300 leading-relaxed">
                Student-led practical engineering ecosystem operating directly from the UPSA Computer Laboratory.
              </p>

              {/* Definition List Layout */}
              <dl className="space-y-2.5 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <dt className="font-extrabold text-[#00AEEF]">Faculty Mentor</dt>
                  <dd className="font-bold text-white">Dr. Augustina Dede Agor</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <dt className="font-extrabold text-[#00AEEF]">Latest Milestone</dt>
                  <dd className="font-bold text-white">400 Students • Network Exposure</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <dt className="font-extrabold text-[#00AEEF]">Venue Anchor</dt>
                  <dd className="font-bold text-white">UPSA Computer Laboratory</dd>
                </div>
              </dl>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('hub')}
                  className="w-full py-3 rounded-lg bg-[#003366] text-[#F2B705] hover:bg-blue-900 border border-[#F2B705]/40 font-extrabold text-xs uppercase tracking-wider text-center transition-all block"
                >
                  View Developers Hub Initiative
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
