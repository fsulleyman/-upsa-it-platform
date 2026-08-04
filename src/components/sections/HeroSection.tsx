import React from 'react';
import type { NavSectionId } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: NavSectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full max-w-full overflow-hidden pt-10 pb-16 bg-[#FFFFFF] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Line */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#003366] uppercase tracking-wider mb-5 flex-wrap">
          <span>UPSA ACCRA</span>
          <span>•</span>
          <span>FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES</span>
          <span>•</span>
          <span className="text-[#00AEEF]">EST. 1965</span>
        </div>

        {/* Hero Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* JOMACS-Grade Confident Hero Headline (68px desktop) */}
            <h1 className="hero-heading">
              Department of Information Technology Studies
            </h1>

            {/* Hero Subtext (22px medium weight line - Noticeably smaller than 68px headline) */}
            <p className="hero-subtext max-w-2xl">
              University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.
            </p>

            {/* Action Buttons (Rectangular rounded-lg buttons with bold label type) */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate('academics')}
                className="px-6 py-3.5 rounded-lg bg-[#003366] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:bg-blue-900 border border-[#F2B705] transition-all flex items-center gap-2 group"
              >
                <span>Explore Academic Programmes</span>
                <ArrowRight className="w-4 h-4 text-[#F2B705] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('innovation')}
                className="px-5 py-3.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] hover:text-[#003366] hover:bg-slate-200 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                <span>Inspect Student Systems & Code</span>
              </button>
            </div>
          </div>

          {/* Right Column: Developers Hub Brief Info Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-xl bg-[#F5F7FA] border border-slate-300 shadow-sm space-y-4">
              
              <div className="pb-3 border-b border-slate-200 flex justify-between items-center">
                <h2 className="subheading font-extrabold text-[#003366]">
                  UPSA Developers Hub
                </h2>
                <span className="text-xs font-bold text-[#555555]">Est. 17 Dec 2025</span>
              </div>

              <p className="body-text text-sm text-[#555555] leading-relaxed">
                Student-led practical engineering ecosystem operating directly from the UPSA Computer Laboratory.
              </p>

              {/* Definition List Layout */}
              <dl className="space-y-2.5 text-xs pt-1">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <dt className="font-extrabold text-[#003366]">Faculty Mentor</dt>
                  <dd className="font-bold text-[#1A1A1A]">Dr. Augustina Dede Agor</dd>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <dt className="font-extrabold text-[#003366]">Latest Milestone</dt>
                  <dd className="font-bold text-[#1A1A1A]">400 Students • Network Exposure</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="font-extrabold text-[#003366]">Verified System</dt>
                  <dd className="font-extrabold text-[#00AEEF]">BloodVault (Baffour Akoto)</dd>
                </div>
              </dl>

              <button
                onClick={() => {
                  onNavigate('hub');
                  window.location.hash = '#hub?modal=join-hub';
                }}
                className="w-full py-3 rounded-lg bg-[#003366] text-[#F2B705] hover:bg-blue-900 font-extrabold text-xs uppercase tracking-wider transition-colors text-center border border-[#F2B705]/40"
              >
                Apply for Hub 2026 Cohort
              </button>

            </div>
          </div>

        </div>

        {/* Stat Counter Strip with Color Pop Emphasis Numbers */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F7FA] border border-slate-300">
            <span className="stat-number text-[#003366]">~400</span>
            <div>
              <div className="font-extrabold text-sm text-[#1A1A1A]">Hub Participants</div>
              <div className="small-text text-[#555555]">Network Infrastructure Program (24-27 Mar 2026)</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F7FA] border border-slate-300">
            <span className="stat-number text-[#003366]">5</span>
            <div>
              <div className="font-extrabold text-sm text-[#1A1A1A]">Qualifications</div>
              <div className="small-text text-[#555555]">Undergraduate, Diploma & Postgraduate Degrees</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F7FA] border border-slate-300">
            <span className="stat-number text-[#003366]">6</span>
            <div>
              <div className="font-extrabold text-sm text-[#1A1A1A]">Research Pillars</div>
              <div className="small-text text-[#555555]">Software Systems, Data Analytics & Security</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
