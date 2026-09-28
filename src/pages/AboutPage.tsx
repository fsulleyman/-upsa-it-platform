import React from 'react';
import type { FacultyMember, NavSectionId } from '../types';
import { AboutSection } from '../components/sections/AboutSection';
import { GraduationCap, Award, Shield, Target, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  faculty: FacultyMember[];
  institutionInfo?: any;
  onNavigate: (section: NavSectionId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ faculty, onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Page Hero Header */}
      <section className="bg-[#003366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Faculty of Information Technology & Communication Studies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">About Department of IT Studies</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Delivering cutting-edge education, applied engineering research, and professional IT management at the University of Professional Studies, Accra.
          </p>
        </div>
      </section>

      {/* Main About Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AboutSection faculty={faculty} />
      </div>

      {/* Values & Credo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-[#F2B705] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#003366] text-lg">Our Mission</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              To produce highly skilled, ethically grounded IT professionals capable of designing, building, and managing enterprise software and data architectures worldwide.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-[#00AEEF] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#003366] text-lg">Our Vision</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              To be a distinguished department recognized across Africa for excellence in IT management, cybersecurity, data science, and hands-on software development.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-emerald-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-[#003366] text-lg">Scholarship with Professionalism</h3>
            <p className="text-xs text-[#555555] leading-relaxed">
              Fusing academic rigor with direct industry certifications, live server room exposure, and student-led software development.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-bold">Explore Our Academic Directory</h3>
            <p className="text-xs text-slate-400">Discover our undergraduate and postgraduate degree programmes.</p>
          </div>
          <button
            onClick={() => onNavigate('academics/programmes')}
            className="px-5 py-3 rounded-lg bg-[#003366] text-white hover:bg-blue-900 border border-[#F2B705] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
          >
            <span>View Programmes</span>
            <ArrowRight className="w-4 h-4 text-[#F2B705]" />
          </button>
        </div>
      </section>
    </div>
  );
};
