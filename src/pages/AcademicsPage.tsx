import React from 'react';
import type { AcademicProgramme, Course, NavSectionId } from '../types';
import { AcademicsSection } from '../components/sections/AcademicsSection';
import { GraduationCap, BookOpen, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AcademicsPageProps {
  programmes: AcademicProgramme[];
  courses: Course[];
  onNavigate: (section: NavSectionId) => void;
  onSelectProgramme: (prog: AcademicProgramme) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({
  programmes,
  courses,
  onNavigate,
  onSelectProgramme
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="bg-[#003366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Department Academic Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Academic Overview & Qualifications</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Choose from industry-aligned undergraduate, postgraduate, and diploma qualifications combining software architecture, data science, cybersecurity, and enterprise IT management.
          </p>
        </div>
      </section>

      {/* Navigation Quick Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            onClick={() => onNavigate('academics/programmes')}
            className="p-8 rounded-2xl bg-gradient-to-br from-[#003366] to-slate-900 text-white shadow-xl cursor-pointer hover:scale-[1.01] transition-transform space-y-4 border border-blue-900"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 text-[#F2B705] flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">Programme Directory ({programmes.length})</h2>
              <p className="text-xs text-slate-300">Browse full degree structures, duration, and entry requirements.</p>
            </div>
            <div className="pt-2 text-xs font-extrabold text-[#F2B705] flex items-center gap-1.5 uppercase tracking-wider">
              <span>View Programme Directory</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('academics/courses')}
            className="p-8 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl cursor-pointer hover:scale-[1.01] transition-transform space-y-4 border border-slate-700"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 text-[#00AEEF] flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">Course Directory Catalog ({courses.length})</h2>
              <p className="text-xs text-slate-300">Search specific courses by code, credit hours, level, and semester.</p>
            </div>
            <div className="pt-2 text-xs font-extrabold text-[#00AEEF] flex items-center gap-1.5 uppercase tracking-wider">
              <span>Browse Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Academics Section Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AcademicsSection programmes={programmes} onSelectProgramme={onSelectProgramme} />
      </div>

      {/* Academic Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-6">
          <h3 className="text-xl font-extrabold text-[#003366]">Why Study IT at UPSA?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-0.5">Hands-On Server Exposure</strong>
                <span className="text-[#555555]">Direct inspection of live UPSA campus fiber backbones, routing racks, and data center servers.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-0.5">Industry-Aligned Syllabi</strong>
                <span className="text-[#555555]">Curricula integrated with software engineering, cybersecurity frameworks, and big data tools.</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1A1A1A] block font-bold text-sm mb-0.5">Developers Hub Ecosystem</strong>
                <span className="text-[#555555]">Student-led innovation lab engineering real production applications for public use.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
