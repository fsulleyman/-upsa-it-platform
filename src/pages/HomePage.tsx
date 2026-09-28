import React from 'react';
import type { NavSectionId, AcademicProgramme, StudentProject, FacultyMember, PromoSlide, HeroContent } from '../types';
import { PromoSlider } from '../components/common/PromoSlider';
import { HeroSection } from '../components/sections/HeroSection';
import { ArrowRight, GraduationCap, FolderGit2, Users, ChevronRight } from 'lucide-react';

interface HomePageProps {
  programmes: AcademicProgramme[];
  projects: StudentProject[];
  faculty: FacultyMember[];
  promoSlides: PromoSlide[];
  heroContent: HeroContent;
  hubDetails?: any;
  institutionInfo?: any;
  footerContent?: any;
  onNavigateSection?: (section: NavSectionId) => void;
  onNavigate?: (section: NavSectionId) => void;
  onSelectProgramme: (prog: AcademicProgramme) => void;
  onSelectProject: (proj: StudentProject) => void;
  onOpenJoinModal?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  programmes,
  projects,
  faculty,
  promoSlides,
  heroContent,
  onNavigateSection,
  onNavigate,
  onSelectProgramme,
  onSelectProject
}) => {
  const handleNav = (sec: NavSectionId) => {
    if (onNavigateSection) {
      onNavigateSection(sec);
    } else if (onNavigate) {
      onNavigate(sec);
    }
  };

  const featuredProgrammes = programmes.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredFaculty = faculty.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero & Banners */}
      <section id="home-hero">
        <PromoSlider slides={promoSlides} onNavigate={handleNav} />
        <HeroSection onNavigate={handleNav} heroContent={heroContent} />
      </section>

      {/* Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl">
          <div className="space-y-1 border-r border-slate-800 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F2B705] block">{programmes.length}</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Academic Degrees</span>
          </div>
          <div className="space-y-1 border-r border-slate-800 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00AEEF] block">{projects.length}</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Student Innovations</span>
          </div>
          <div className="space-y-1 border-r border-slate-800 pr-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 block">{faculty.length}</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Faculty Members</span>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 block">400+</span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Hub Engineers</span>
          </div>
        </div>
      </section>

      {/* Featured Academic Programmes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-[#F2B705]" />
              <span>Academic Degrees & Qualifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">Featured Qualifications</h2>
          </div>
          <button
            onClick={() => handleNav('academics/programmes')}
            className="px-4 py-2 rounded-lg bg-[#003366] text-white hover:bg-blue-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>View All Programmes</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B705]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProgrammes.map((prog) => (
            <div
              key={prog.id}
              onClick={() => onSelectProgramme(prog)}
              className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2.5 py-1 rounded bg-[#003366] text-white font-mono text-xs font-bold">
                    {prog.code}
                  </span>
                  <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
                    {prog.level}
                  </span>
                </div>
                <h3 className="font-extrabold text-[#1A1A1A] text-lg leading-snug">{prog.name}</h3>
                <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">{prog.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4 flex justify-between items-center text-xs font-bold text-[#003366]">
                <span>{prog.duration}</span>
                <span className="flex items-center gap-1">Details <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Student Innovations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider mb-1">
              <FolderGit2 className="w-4 h-4 text-[#00AEEF]" />
              <span>Engineered Systems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">Student Innovations Spotlight</h2>
          </div>
          <button
            onClick={() => handleNav('innovation')}
            className="px-4 py-2 rounded-lg bg-[#003366] text-white hover:bg-blue-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B705]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="rounded-2xl bg-[#F5F7FA] border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {project.imageUrl && (
                  <div className="w-full h-40 bg-slate-200 overflow-hidden relative">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#003366] block">{project.category}</span>
                  <h3 className="font-extrabold text-[#1A1A1A] text-base">{project.title}</h3>
                  <p className="text-xs text-[#555555] line-clamp-2">{project.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 text-xs font-bold text-slate-600 flex justify-between items-center border-t border-slate-200/60 mt-2">
                <span>By {project.studentName}</span>
                <span className="text-[#003366]">View System →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#003366] uppercase tracking-wider mb-1">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Academic Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">Faculty & Researchers</h2>
          </div>
          <button
            onClick={() => handleNav('it-department/faculty')}
            className="px-4 py-2 rounded-lg bg-[#003366] text-white hover:bg-blue-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <span>Meet Our Faculty</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F2B705]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFaculty.map((member) => (
            <div
              key={member.id}
              onClick={() => handleNav(`faculty/${member.profileSlug || member.id}` as NavSectionId)}
              className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-lg transition-all cursor-pointer text-center space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {member.avatarUrl && (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#003366] mx-auto shadow-md">
                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-[#1A1A1A] text-base">{member.name}</h3>
                  <span className="text-xs font-bold text-[#003366] block">{member.title}</span>
                  <span className="text-[11px] font-mono text-slate-500 block">{member.academicDegree}</span>
                </div>
                <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">{member.bio}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 text-xs font-bold text-[#003366]">
                View Academic Profile →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#003366] text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="px-3 py-1 rounded-full bg-[#F2B705] text-[#003366] font-extrabold text-xs tracking-wider uppercase inline-block">
              UPSA IT STUDIES ENROLMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Ready to Advance Your IT Career?</h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Explore our degree programmes or connect directly with the department secretariat for admissions inquiries.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 relative z-10 pt-2">
            <button
              onClick={() => handleNav('academics/programmes')}
              className="px-6 py-3.5 rounded-xl bg-[#F2B705] text-[#003366] font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:bg-yellow-400 transition-colors"
            >
              Explore Programmes
            </button>
            <button
              onClick={() => handleNav('contact')}
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-colors"
            >
              Contact Secretariat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
