import React from 'react';
import type { FooterContent, NavSectionId } from '../types';
import { ContactSection } from '../components/sections/ContactSection';
import { Building2 } from 'lucide-react';

interface ContactPageProps {
  institutionInfo?: any;
  footerContent?: FooterContent;
  onNavigate?: (section: NavSectionId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  institutionInfo,
  footerContent
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Department Secretariat Contact</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Official Admissions & Secretariat Contact</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Reach out directly to the Department of Information Technology Studies office at Justice Aryeetey Building, UPSA Accra.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContactSection institutionInfo={institutionInfo} footerContent={footerContent} />
      </div>
    </div>
  );
};
