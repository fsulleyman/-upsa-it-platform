import React, { useState } from 'react';
import type { FacultyMember, NavSectionId } from '../types';
import { Users, Search, ChevronRight } from 'lucide-react';

interface FacultyPageProps {
  faculty: FacultyMember[];
  onNavigate?: (section: NavSectionId) => void;
  onSelectFaculty?: (facultyId: string) => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ faculty, onNavigate, onSelectFaculty }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeFaculty = faculty.filter((f) => f.isActive ?? true);

  const filteredFaculty = activeFaculty.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.title.toLowerCase().includes(query) ||
      member.academicDegree.toLowerCase().includes(query) ||
      (member.specialization && member.specialization.some((s) => s.toLowerCase().includes(query)))
    );
  });

  const handleMemberClick = (member: FacultyMember) => {
    if (onSelectFaculty) {
      onSelectFaculty(member.id);
    } else if (onNavigate) {
      onNavigate(`faculty/${member.profileSlug || member.id}` as NavSectionId);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>IT Department Academic Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Faculty & Leadership Directory</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Meet the academic staff, senior lecturers, researchers, and Head of Department guiding IT Studies at UPSA.
          </p>
        </div>
      </section>

      {/* Search & Directory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-extrabold text-[#003366] uppercase tracking-wider">
            Displaying {filteredFaculty.length} Academic Staff Members
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Directory Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                onClick={() => handleMemberClick(member)}
                className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4 text-center">
                  {member.avatarUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#003366] mx-auto shadow-md">
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-1">
                    {member.isHOD && (
                      <span className="px-2 py-0.5 rounded bg-[#003366] text-[#F2B705] font-mono text-[10px] font-extrabold uppercase">
                        HEAD OF DEPARTMENT
                      </span>
                    )}
                    <h2 className="font-extrabold text-[#1A1A1A] text-lg leading-snug">{member.name}</h2>
                    <span className="text-xs font-bold text-[#003366] block">{member.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 block">{member.academicDegree}</span>
                  </div>

                  <p className="text-xs text-[#555555] line-clamp-3 leading-relaxed">{member.bio}</p>

                  {/* Specializations */}
                  {member.specialization && member.specialization.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 pt-1">
                      {member.specialization.slice(0, 3).map((spec, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs font-extrabold text-[#003366] text-center flex items-center justify-center gap-1">
                  <span>View Full Academic Profile</span>
                  <ChevronRight className="w-4 h-4 text-[#F2B705]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
            <h3 className="text-lg font-bold text-[#1A1A1A]">Faculty profiles are currently being updated.</h3>
            <p className="text-xs text-slate-500">No matching faculty members found for search criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
};
