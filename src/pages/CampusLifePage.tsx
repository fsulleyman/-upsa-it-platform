import React from 'react';
import type { NavSectionId, StudentProject } from '../types';
import {
  CLUBS_DATA,
  CAMPUS_EVENTS_DATA,
  CAMPUS_ACTIVITIES_DATA,
  CAMPUS_ACHIEVEMENTS_DATA
} from '../data/campusLifeData';
import {
  Users,
  Calendar,
  Zap,
  Award,
  Code2,
  Globe,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle
} from 'lucide-react';

interface CampusLifePageProps {
  onNavigate: (section: NavSectionId) => void;
  onOpenJoinModal: () => void;
  onSelectProject?: (project: StudentProject) => void;
  activeTab?: string | null;
  activeClubId?: string | null;
  projects?: StudentProject[];
}

export const CampusLifePage: React.FC<CampusLifePageProps> = ({
  onNavigate,
  onOpenJoinModal,
  onSelectProject,
  activeTab,
  activeClubId,
  projects = []
}) => {
  const currentTab = activeTab || 'clubs';

  const selectedClub = activeClubId
    ? CLUBS_DATA.find((c) => c.id === activeClubId) || null
    : null;

  const handleSelectTab = (tabId: string) => {
    if (tabId === 'communities') {
      onNavigate('community');
    } else if (tabId === 'projects') {
      onNavigate('innovation');
    } else {
      window.location.hash = `#/campus-life?tab=${tabId}`;
    }
  };

  const handleSelectClub = (clubId: string | null) => {
    if (clubId) {
      window.location.hash = `#/campus-life?club=${clubId}`;
    } else {
      window.location.hash = `#/campus-life?tab=clubs`;
    }
  };

  return (
    <div className="space-y-0 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              <Users className="w-4 h-4" />
              <span>DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES • CAMPUS LIFE</span>
            </div>
            <button
              onClick={() => {
                if (selectedClub) {
                  handleSelectClub(null);
                } else {
                  onNavigate('home');
                }
              }}
              className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{selectedClub ? 'Back to All Clubs' : 'Back to Main Page'}</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {selectedClub ? selectedClub.name : 'Campus Life & Student Societies'}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            {selectedClub
              ? selectedClub.tagline
              : 'The central hub for student technical societies, industry learning networks, university events, hackathons, and practical software engineering at UPSA.'}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Single Club Detail Mode */}
        {selectedClub ? (
          <div className="space-y-8">
            {/* Club Overview Banner Card */}
            <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-md bg-[#003366] text-[#F2B705] font-mono text-xs font-extrabold uppercase">
                      {selectedClub.category}
                    </span>
                    {selectedClub.isFlagship && (
                      <span className="px-3 py-1 rounded-md bg-[#F2B705] text-[#003366] font-mono text-xs font-black uppercase shadow-xs">
                        DEPARTMENT FLAGSHIP SOCIETY
                      </span>
                    )}
                    {selectedClub.isPlaceholder && (
                      <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
                        [Development Placeholder Data]
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A]">
                    About {selectedClub.name}
                  </h2>
                </div>

                {selectedClub.id === 'dev-hub' && (
                  <button
                    onClick={onOpenJoinModal}
                    className="px-6 py-3 rounded-xl bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-colors cursor-pointer shrink-0"
                  >
                    Join {selectedClub.shortName} Cohort
                  </button>
                )}
              </div>

              <p className="body-text text-base text-[#555555] leading-relaxed">
                {selectedClub.description}
              </p>

              {/* Leadership & Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">Faculty Leadership & Mentor</span>
                  <p className="text-sm font-extrabold text-[#1A1A1A]">{selectedClub.mentorName}</p>
                  <p className="text-xs text-slate-500">{selectedClub.mentorRole}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">Student Leadership</span>
                  <p className="text-sm font-extrabold text-[#1A1A1A]">{selectedClub.studentLead}</p>
                  <p className="text-xs text-slate-500">{selectedClub.studentLeadRole}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">Membership & Location</span>
                  <p className="text-sm font-extrabold text-[#1A1A1A]">{selectedClub.memberCount}</p>
                  <p className="text-xs text-slate-500">{selectedClub.meetingLocation}</p>
                </div>
              </div>

              {/* Activities List */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-xs font-mono font-extrabold text-[#003366] uppercase tracking-wider">
                  Key Society Activities & Learning Sprints
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedClub.activities.map((act, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-[#F5F7FA] border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                      <CheckCircle className="w-4 h-4 text-[#003366] shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Club Projects & Systems */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-[#003366] uppercase tracking-wide">
                  Systems & Prototypes Engineered by {selectedClub.shortName}
                </h3>
                <button
                  onClick={() => onNavigate('innovation')}
                  className="text-xs font-extrabold text-[#003366] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Innovations</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onSelectProject?.(proj)}
                    className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-lg transition-all cursor-pointer space-y-3"
                  >
                    <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">
                      {proj.category}
                    </span>
                    <h4 className="text-lg font-extrabold text-[#1A1A1A]">{proj.title}</h4>
                    <p className="text-xs text-[#555555] line-clamp-2">{proj.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#003366]">
                      <span>Student Lead: {proj.studentName}</span>
                      <span className="flex items-center gap-1">Inspect System <ExternalLink className="w-3 h-3" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Standard Multi-Tab Campus Life View */
          <div className="space-y-8">
            {/* 6 Pillars Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
              {[
                { id: 'clubs', label: 'Clubs & Societies', icon: Users },
                { id: 'communities', label: 'Communities', icon: Globe },
                { id: 'events', label: 'Events', icon: Calendar },
                { id: 'activities', label: 'Activities', icon: Zap },
                { id: 'projects', label: 'Student Projects', icon: Code2 },
                { id: 'achievements', label: 'Achievements', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#003366] text-[#F2B705] shadow-md border border-[#F2B705]/40'
                        : 'bg-[#F5F7FA] text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Clubs & Societies Directory */}
            {currentTab === 'clubs' && (
              <div className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="section-heading text-2xl sm:text-3xl">Department Technical Societies & Clubs</h2>
                  <p className="body-text text-sm sm:text-base text-[#555555]">
                    Explore student-led societies fostering practical coding, cybersecurity, data science, and IT leadership.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CLUBS_DATA.map((club) => (
                    <div
                      key={club.id}
                      onClick={() => handleSelectClub(club.id)}
                      className="group rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer p-6 flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-[#003366] text-[#F2B705] font-mono text-[10px] font-extrabold uppercase">
                            {club.category}
                          </span>
                          {club.isFlagship && (
                            <span className="px-2.5 py-0.5 rounded bg-[#F2B705] text-[#003366] font-mono text-[10px] font-black uppercase">
                              FLAGSHIP
                            </span>
                          )}
                          {club.isPlaceholder && (
                            <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">
                              [Sample]
                            </span>
                          )}
                        </div>

                        <h3 className="subheading text-xl font-extrabold text-[#1A1A1A] group-hover:text-[#003366] transition-colors">
                          {club.name}
                        </h3>

                        <p className="body-text text-xs text-[#555555] line-clamp-3 leading-relaxed">
                          {club.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 space-y-3">
                        <div className="text-xs text-slate-600 space-y-1">
                          <span className="block font-semibold">Faculty Mentor: <strong className="text-[#1A1A1A]">{club.mentorName}</strong></span>
                          <span className="block text-[11px] text-slate-500">{club.memberCount}</span>
                        </div>

                        <button className="w-full py-2.5 rounded-lg bg-[#F5F7FA] group-hover:bg-[#003366] text-[#003366] group-hover:text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 border border-slate-300">
                          <span>Explore Society</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#F2B705]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Communities */}
            {currentTab === 'communities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 max-w-3xl">
                  <div>
                    <h2 className="section-heading text-2xl sm:text-3xl">Industry Communities & Traditions</h2>
                    <p className="body-text text-sm sm:text-base text-[#555555] mt-1">
                      Professional technical networks and landmark faculty learning traditions.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('community')}
                    className="px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Go to Full Community Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-300 inline-block">
                      INDUSTRY PARTNERSHIP
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#1A1A1A]">DataCamp Classroom Partnership</h3>
                    <p className="text-sm text-[#555555] leading-relaxed">
                      Granting IT Studies students direct access to hands-on data science, Python analytics, SQL data warehousing, and R programming coursework.
                    </p>
                    <button
                      onClick={() => onNavigate('community')}
                      className="text-xs font-extrabold text-emerald-800 hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
                    >
                      <span>Explore DataCamp Integration →</span>
                    </button>
                  </div>

                  <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <span className="text-xs font-mono font-bold text-[#003366] bg-blue-50 px-3 py-1 rounded-md border border-blue-200 inline-block">
                      FACULTY TRADITION
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#1A1A1A]">Annual FITCS Executive Master Class Series</h3>
                    <p className="text-sm text-[#555555] leading-relaxed">
                      Landmark faculty tradition bringing top industry executives, CTOs, and cybersecurity auditors directly into the classroom for intensive mentorship.
                    </p>
                    <button
                      onClick={() => onNavigate('community')}
                      className="text-xs font-extrabold text-[#003366] hover:underline inline-flex items-center gap-1 pt-2 cursor-pointer"
                    >
                      <span>View Master Class Details →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Events */}
            {currentTab === 'events' && (
              <div className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="section-heading text-2xl sm:text-3xl">University & Society Events</h2>
                  <p className="body-text text-sm sm:text-base text-[#555555]">
                    Upcoming and recent academic forums, Guided network inspections, and student practical drills.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {CAMPUS_EVENTS_DATA.map((ev) => (
                    <div key={ev.id} className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-[#003366] text-[#F2B705] font-mono text-[10px] font-extrabold uppercase">
                            {ev.badgeText}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{ev.date}</span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#1A1A1A]">{ev.title}</h3>
                        <p className="text-xs text-[#555555] leading-relaxed">{ev.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                        <span>Location: <strong>{ev.location}</strong></span>
                        {ev.registrationInfo && (
                          <span className="font-bold text-[#003366]">{ev.registrationInfo}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Activities */}
            {currentTab === 'activities' && (
              <div className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="section-heading text-2xl sm:text-3xl">Student Activities & Skill Sprints</h2>
                  <p className="body-text text-sm sm:text-base text-[#555555]">
                    Practical technical activities, code sprints, and skill development workshops.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CAMPUS_ACTIVITIES_DATA.map((act) => (
                    <div key={act.id} className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">
                          {act.category}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1A1A1A]">{act.title}</h3>
                        <p className="text-xs text-[#555555] leading-relaxed">{act.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-500 block">Schedule: {act.schedule}</span>
                        <div className="flex flex-wrap gap-1">
                          {act.highlights.map((h, i) => (
                            <span key={i} className="text-[10px] bg-[#F5F7FA] px-2 py-0.5 rounded border border-slate-200 font-medium">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Student Projects Overview */}
            {currentTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 max-w-3xl">
                  <div>
                    <h2 className="section-heading text-2xl sm:text-3xl">Student Systems & Prototypes</h2>
                    <p className="body-text text-sm sm:text-base text-[#555555] mt-1">
                      Verified software systems engineered by UPSA IT Studies students under faculty mentorship.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('innovation')}
                    className="px-5 py-2.5 rounded-xl bg-[#003366] text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-900 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Full Innovation Showcase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onSelectProject?.(proj)}
                      className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-lg transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-[#003366] uppercase block">
                          {proj.category}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1A1A1A]">{proj.title}</h3>
                        <p className="text-xs text-[#555555] line-clamp-3">{proj.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-[#003366]">
                        <span>Student Lead: {proj.studentName}</span>
                        <span className="flex items-center gap-1">Inspect <ExternalLink className="w-3 h-3" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: Achievements */}
            {currentTab === 'achievements' && (
              <div className="space-y-6">
                <div className="max-w-3xl space-y-2">
                  <h2 className="section-heading text-2xl sm:text-3xl">Student & Society Achievements</h2>
                  <p className="body-text text-sm sm:text-base text-[#555555]">
                    National press features, international conference presentations, and enterprise infrastructure certifications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {CAMPUS_ACHIEVEMENTS_DATA.map((ach) => (
                    <div key={ach.id} className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[10px] font-extrabold uppercase">
                            {ach.category}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{ach.date}</span>
                        </div>

                        <h3 className="text-base font-extrabold text-[#1A1A1A]">{ach.title}</h3>
                        <p className="text-xs text-[#555555] leading-relaxed">{ach.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                        <span>Issuer: <strong>{ach.issuer}</strong></span>
                        {ach.articleUrl && (
                          <a
                            href={ach.articleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[#003366] hover:underline flex items-center gap-1"
                          >
                            <span>Read Feature</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
