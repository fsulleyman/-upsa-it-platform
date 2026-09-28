import React from 'react';
import type { NavSectionId, HeroContent } from '../../types';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: NavSectionId) => void;
  heroContent?: HeroContent;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, heroContent }) => {
  const topLine = heroContent?.topLine || 'UPSA ACCRA • FACULTY OF INFORMATION TECHNOLOGY & COMMUNICATION STUDIES • EST. 1965';
  const headline = heroContent?.headline || 'Department of Information Technology Studies';
  const subtext = heroContent?.subtext || 'University of Professional Studies, Accra (UPSA). Delivering undergraduate and postgraduate qualifications combining enterprise software architecture, cybersecurity, and data science with professional IT management.';
  const primaryCtaText = heroContent?.primaryCtaText || 'Explore Academic Programmes';
  const primaryCtaLink = (heroContent?.primaryCtaLink as NavSectionId) || 'academics';
  const secondaryCtaText = heroContent?.secondaryCtaText || 'Inspect Student Systems & Code';
  const secondaryCtaLink = (heroContent?.secondaryCtaLink as NavSectionId) || 'innovation';

  return (
    <section className="relative w-full max-w-full overflow-hidden pt-10 pb-16 bg-[#FFFFFF] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Institutional Line */}
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#003366] uppercase tracking-wider mb-5 flex-wrap">
          <span>{topLine}</span>
        </div>

        {/* Hero Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* JOMACS-Grade Confident Hero Headline (68px desktop) */}
            <h1 className="hero-heading">
              {headline}
            </h1>

            {/* Hero Subtext (22px medium weight line) */}
            <p className="hero-subtext max-w-2xl">
              {subtext}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigate(primaryCtaLink)}
                className="px-6 py-3.5 rounded-lg bg-[#003366] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:bg-blue-900 border border-[#F2B705] transition-all flex items-center gap-2 group"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-[#F2B705] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate(secondaryCtaLink)}
                className="px-5 py-3.5 rounded-lg bg-[#F5F7FA] border border-slate-300 text-[#1A1A1A] hover:text-[#003366] hover:bg-slate-200 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all"
              >
                <span>{secondaryCtaText}</span>
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
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <dt className="font-extrabold text-[#003366]">Venue Anchor</dt>
                  <dd className="font-bold text-[#1A1A1A]">UPSA Computer Laboratory</dd>
                </div>
              </dl>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('hub')}
                  className="w-full py-3 rounded-lg bg-[#003366] text-white hover:bg-blue-900 font-extrabold text-xs uppercase tracking-wider text-center transition-all block"
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
