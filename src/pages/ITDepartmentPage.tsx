import React from 'react';
import type { FacultyMember, ResearchProject, NavSectionId } from '../types';
import { Building2, Users, BookOpen, FlaskConical, ArrowRight } from 'lucide-react';

interface ITDepartmentPageProps {
  faculty: FacultyMember[];
  courses?: any[];
  researchProjects?: ResearchProject[];
  onNavigate: (section: NavSectionId) => void;
}

export const ITDepartmentPage: React.FC<ITDepartmentPageProps> = ({
  faculty,
  onNavigate
}) => {
  const hod = faculty.find((f) => f.isHOD) || faculty[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Faculty of Information Technology & Communication Studies</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Department of Information Technology Studies</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            The core technology hub at UPSA Accra. Empowering students through enterprise systems architecture, data science analytics, and software engineering leadership.
          </p>
        </div>
      </section>

      {/* Head of Department Message Spotlight */}
      {hod && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#F5F7FA] border-2 border-[#003366]/20 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {hod.avatarUrl && (
              <div className="md:col-span-4 flex justify-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-[#003366] shadow-xl">
                  <img src={hod.avatarUrl} alt={hod.name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-[#003366] text-[#F2B705] text-xs font-extrabold font-mono uppercase tracking-wider inline-block">
                MESSAGE FROM THE HEAD OF DEPARTMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">{hod.name}</h2>
              <span className="text-xs font-bold text-[#003366] block">{hod.title}</span>
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed italic">
                "{hod.bio}"
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate(`faculty/${hod.profileSlug || hod.id}` as NavSectionId)}
                  className="px-4 py-2 rounded-lg bg-[#003366] text-white hover:bg-blue-900 text-xs font-bold uppercase tracking-wider"
                >
                  View HOD Academic Profile →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => onNavigate('it-department/faculty')}
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-[#F2B705] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Faculty & Staff Directory</h3>
            <p className="text-xs text-[#555555]">Browse academic profiles, research interests, and office contact hours of department lecturers.</p>
            <div className="pt-2 text-xs font-bold text-[#003366] flex items-center gap-1">
              <span>View Directory</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('research')}
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-[#00AEEF] flex items-center justify-center font-bold">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Research & Publications</h3>
            <p className="text-xs text-[#555555]">Explore active department research projects, AI diagnostics, and journal publications.</p>
            <div className="pt-2 text-xs font-bold text-[#003366] flex items-center gap-1">
              <span>Explore Research</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('academics/courses')}
            className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#003366] text-emerald-400 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-extrabold text-[#1A1A1A]">Teaching & Course Outline</h3>
            <p className="text-xs text-[#555555]">Search credit hours, course codes, and module syllabi across IT Studies degrees.</p>
            <div className="pt-2 text-xs font-bold text-[#003366] flex items-center gap-1">
              <span>Search Courses</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
