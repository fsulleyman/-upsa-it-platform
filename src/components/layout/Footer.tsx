import React from 'react';
import { INSTITUTION_INFO } from '../../data/groundTruth';
import type { NavSectionId } from '../../types';
import { GraduationCap, MapPin, Phone, Mail, Globe, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: NavSectionId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#003366] text-white border-t-4 border-[#F2B705]">
      
      {/* Top Main Footer Section (60% UPSA Blue #003366) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1 & 2: Institutional Identity & Motto */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white text-[#003366] border-2 border-[#F2B705] flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-7 h-7 text-[#003366]" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-white uppercase">
                  UPSA <span className="text-xs font-bold text-[#00AEEF] font-sans tracking-normal uppercase">• IT STUDIES</span>
                </h3>
                <div className="text-xs font-black text-[#F2B705] tracking-widest uppercase mt-0.5">
                  Scholarship with Professionalism
                </div>
              </div>
            </div>

            <p className="body-text text-sm text-slate-200 leading-relaxed max-w-sm">
              The Department of Information Technology Studies sits inside the Faculty of Information Technology and Communication Studies (FITCS) at the University of Professional Studies, Accra.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>Ghana Digital Address: <strong className="text-white font-mono">{INSTITUTION_INFO.digitalAddress}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00AEEF] shrink-0" />
                <span>P.O. Box LG 149, Accra – Ghana</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
              ACADEMICS & HUB
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-200 font-semibold">
              <li>
                <button onClick={() => onNavigate('academics')} className="hover:text-[#F2B705] transition-colors">
                  Academic Programmes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hub')} className="hover:text-[#F2B705] transition-colors flex items-center gap-1.5">
                  <span>UPSA Developers Hub</span>
                  <span className="text-[10px] font-mono text-[#00AEEF] bg-blue-950 px-1.5 py-0.5 rounded border border-[#00AEEF]">EST. 2025</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('innovation')} className="hover:text-[#F2B705] transition-colors">
                  Student Innovations & Showcase
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('community')} className="hover:text-[#F2B705] transition-colors">
                  DataCamp Classroom Integration
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Admissions & Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
              ADMISSIONS & FACULTY
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-200 font-semibold">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#F2B705] transition-colors">
                  About FITCS Faculty
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#F2B705] transition-colors">
                  Faculty Secretariat Contact
                </button>
              </li>
              <li>
                <a 
                  href="https://upsa.edu.gh" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#F2B705] transition-colors inline-flex items-center gap-1 text-[#00AEEF]"
                >
                  <span>Official UPSA Website</span>
                  <ArrowUpRight className="w-3 h-3 text-[#F2B705]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Secretariat Telephones */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#F2B705] border-b border-[#002244] pb-2">
              TELEPHONE CONTACTS
            </h4>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Admissions & Secretariat Tel:</span>
                  <span className="block font-mono font-bold text-white text-xs">{INSTITUTION_INFO.facultyPhone}</span>
                  <span className="block font-mono text-slate-300 text-[11px]">Switchboard: {INSTITUTION_INFO.switchboard}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Mail className="w-4 h-4 text-[#00AEEF] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Official Email:</span>
                  <span className="font-mono font-bold text-white text-[11px]">
                    {INSTITUTION_INFO.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar (#002244 Deep Navy) */}
      <div className="w-full bg-[#002244] text-slate-300 text-xs py-4 px-4 sm:px-6 lg:px-8 border-t border-blue-900/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Department of Information Technology Studies — Faculty of Information Technology and Communication Studies, UPSA.
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <a href="https://upsa.edu.gh" target="_blank" rel="noreferrer" className="hover:text-[#F2B705]">UPSA Portal</a>
            <span>•</span>
            <span className="text-[#00AEEF] font-mono">P.O. Box LG 149, Accra</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
