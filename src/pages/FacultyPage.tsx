import React, { useState } from 'react';
import type { FacultyMember, NavSectionId } from '../types';
import { Users, Search, Mail, MapPin, Phone, GraduationCap, Award, BookOpen, ExternalLink, X, ChevronRight, Briefcase } from 'lucide-react';

interface FacultyPageProps {
  faculty: FacultyMember[];
  onNavigate: (section: NavSectionId) => void;
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ faculty, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  const activeFaculty = faculty.filter((f) => f.isActive ?? true);

  // Filter logic
  const filteredFaculty = activeFaculty.filter((member) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(query) ||
      member.title.toLowerCase().includes(query) ||
      (member.role && member.role.toLowerCase().includes(query)) ||
      (member.academicDegree && member.academicDegree.toLowerCase().includes(query)) ||
      (member.specialization && member.specialization.some((s) => s.toLowerCase().includes(query))) ||
      (member.researchInterests && member.researchInterests.some((r) => r.toLowerCase().includes(query)));

    const matchesRole =
      roleFilter === 'All' ||
      (roleFilter === 'HOD' && member.isHOD) ||
      (member.role && member.role.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#002244] border-b-4 border-[#F2B705] text-white py-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider font-mono">
              <Users className="w-4 h-4" />
              <span>DEPARTMENT OF INFORMATION TECHNOLOGY STUDIES</span>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              ← Back to Main Page
            </button>
          </div>

          <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-slate-900">
            <img
              src="/images/banner_faculty_directory.png"
              alt="Faculty & Staff Directory Banner"
              className="w-full h-auto object-cover object-center max-h-[380px]"
            />
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#F5F7FA] border border-slate-300 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Role Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'HOD', 'Lecturer', 'Senior Lecturer'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors ${
                  roleFilter === role
                    ? 'bg-[#003366] text-[#F2B705] border border-[#F2B705]/50'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {role === 'HOD' ? 'Head of Dept' : role}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by lecturer name, title, or interest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-medium text-[#1A1A1A] focus:outline-none focus:border-[#003366]"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-white border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Photo & HOD Badge */}
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#003366] mx-auto shadow-md bg-slate-100 flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-slate-400" />
                    )}
                  </div>

                  {/* Identity */}
                  <div className="text-center space-y-1">
                    {member.isHOD && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#003366] text-[#F2B705] font-mono text-[10px] font-extrabold uppercase inline-block mb-1">
                        HEAD OF DEPARTMENT
                      </span>
                    )}
                    <h2 className="font-extrabold text-[#1A1A1A] text-lg leading-snug">{member.name}</h2>
                    <span className="text-xs font-bold text-[#003366] block">{member.title}</span>
                    <span className="text-[11px] font-mono text-slate-500 block">{member.academicDegree || 'Not provided'}</span>
                  </div>

                  {/* Specialization / Research Summary */}
                  {((member.specialization && member.specialization.length > 0) || (member.researchInterests && member.researchInterests.length > 0)) && (
                    <div className="flex flex-wrap justify-center gap-1 pt-1">
                      {(member.specialization || member.researchInterests || []).slice(0, 3).map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quick Contact & Office */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#003366] shrink-0" />
                      <span className="truncate">{member.officeLocation || member.office || 'IT Block'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-[#00AEEF] shrink-0" />
                      <span className="truncate">{member.email || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                {/* View Profile Action Button */}
                <button
                  onClick={() => setSelectedFaculty(member)}
                  className="w-full py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
                >
                  <span>VIEW PROFILE</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F2B705]" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-[#F5F7FA] border border-slate-300 space-y-2">
            <h3 className="text-lg font-bold text-[#1A1A1A]">Faculty profiles are currently being updated.</h3>
            <p className="text-xs text-slate-500">No matching faculty members found for your search criteria.</p>
          </div>
        )}
      </section>

      {/* Individual Faculty Profile Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-3xl overflow-hidden shadow-2xl space-y-0 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#003366] text-white p-6 sm:p-8 relative border-b-4 border-[#F2B705]">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#F2B705] shadow-md bg-slate-200 shrink-0 flex items-center justify-center">
                  {selectedFaculty.avatarUrl ? (
                    <img src={selectedFaculty.avatarUrl} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                <div className="text-center sm:text-left space-y-1">
                  {selectedFaculty.isHOD && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F2B705] text-[#003366] font-mono text-[10px] font-extrabold uppercase inline-block mb-1">
                      HEAD OF DEPARTMENT
                    </span>
                  )}
                  <h2 className="text-2xl font-extrabold">{selectedFaculty.name}</h2>
                  <p className="text-xs font-bold text-[#F2B705]">{selectedFaculty.title}</p>
                  <p className="text-xs font-mono text-slate-200">{selectedFaculty.academicDegree || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-[#1A1A1A]">
              {/* Contact Information */}
              <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#00AEEF]" />
                  <span>Contact & Office Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="font-bold text-slate-500 block">Email Address</span>
                    <span>{selectedFaculty.email || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#00AEEF]" /> Phone Number
                    </span>
                    <span>{selectedFaculty.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Office Location</span>
                    <span>{selectedFaculty.officeLocation || selectedFaculty.office || selectedFaculty.officeNumber || 'IT Block'}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block">Office Hours</span>
                    <span>{selectedFaculty.officeHours || 'By Appointment'}</span>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#F2B705]" />
                  <span>Biography & Academic Background</span>
                </h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedFaculty.biography || selectedFaculty.bio || 'Biography information will be updated by the department.'}
                </p>
              </div>

              {/* Qualifications */}
              {selectedFaculty.qualifications && selectedFaculty.qualifications.length > 0 && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#F2B705]" />
                    <span>Academic Qualifications</span>
                  </h3>
                  <ul className="space-y-1 text-slate-700">
                    {selectedFaculty.qualifications.map((qual, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#003366]" />
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Teaching Areas & Courses */}
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Teaching Areas & Courses Taught</span>
                </h3>
                {selectedFaculty.teachingAreas && selectedFaculty.teachingAreas.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedFaculty.teachingAreas.map((area, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-300 font-semibold text-slate-700">
                        {area}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Course information will be updated by the department.</p>
                )}
              </div>

              {/* Research Interests */}
              {((selectedFaculty.researchInterests && selectedFaculty.researchInterests.length > 0) ||
                (selectedFaculty.researchTopics && selectedFaculty.researchTopics.length > 0)) && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Research Interests & Topics</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedFaculty.researchInterests || selectedFaculty.researchTopics || []).map((topic, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Academic Links */}
              {(selectedFaculty.googleScholarUrl || selectedFaculty.orcidUrl || selectedFaculty.linkedinUrl) && (
                <div className="space-y-2 border-t border-slate-200 pt-4">
                  <h3 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-[#003366]" />
                    <span>Academic Profiles & Publications</span>
                  </h3>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {selectedFaculty.googleScholarUrl && (
                      <a
                        href={selectedFaculty.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                      >
                        <span>Google Scholar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedFaculty.orcidUrl && (
                      <a
                        href={selectedFaculty.orcidUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                      >
                        <span>ORCID Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedFaculty.linkedinUrl && (
                      <a
                        href={selectedFaculty.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#003366]/10 text-[#003366] border border-[#003366]/30 font-bold flex items-center gap-1 hover:bg-[#003366]/20 transition-colors"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-5 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
