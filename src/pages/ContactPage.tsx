import React from 'react';
import type { NavSectionId, FooterContent } from '../types';
import { ContactSection } from '../components/sections/ContactSection';
import { Mail, ArrowLeft } from 'lucide-react';

interface ContactPageProps {
  institutionInfo?: {
    facultyLocation?: string;
    address?: string;
    email?: string;
    facultyPhone?: string;
    switchboard?: string;
  };
  footerContent?: FooterContent;
  onNavigate: (section: NavSectionId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  institutionInfo,
  footerContent,
  onNavigate
}) => {
  return (
    <div className="space-y-0 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              <Mail className="w-4 h-4" />
              <span>DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES</span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Page</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Official Enquiries & Admissions Contact</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Reach out to the Department Secretariat regarding academic programmes, Developers Hub admissions, or research partnerships.
          </p>
        </div>
      </section>

      {/* Main Contact Section Content */}
      <ContactSection
        institutionInfo={institutionInfo}
        footerContent={footerContent}
      />
    </div>
  );
};
