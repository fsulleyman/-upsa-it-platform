import React from 'react';
import type { FacultyMember, Course, FacultyPublication, ResearchProject, NavSectionId } from '../types';
import { Mail, MapPin, GraduationCap, BookOpen, FlaskConical, Award, FileText, ArrowLeft } from 'lucide-react';

interface LecturerProfilePageProps {
  facultyId: string | null;
  faculty: FacultyMember[];
  courses: Course[];
  publications: FacultyPublication[];
  researchProjects?: ResearchProject[];
  onNavigate: (section: NavSectionId) => void;
}

export const LecturerProfilePage: React.FC<LecturerProfilePageProps> = ({
  facultyId,
  faculty,
  courses,
  publications,
  researchProjects = [],
  onNavigate
}) => {
  const member = faculty.find((f) => f.profileSlug === facultyId || f.id === facultyId) || faculty[0];

  if (!member) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Faculty Member Profile Not Found</h2>
        <button onClick={() => onNavigate('it-department/faculty')} className="px-4 py-2 bg-[#003366] text-white rounded-lg text-xs font-bold">
          Return to Faculty Directory
        </button>
      </div>
    );
  }

  const memberCourses = courses.filter((c) => c.lecturerIds && c.lecturerIds.includes(member.id));
  const memberPublications = publications.filter((p) => p.facultyId === member.id);
  const memberProjects = researchProjects.filter((rp) => rp.leadFacultyId === member.id);

  return (
    <div className="space-y-12 pb-16">
      {/* Back Button Bar */}
      <section className="bg-slate-900 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('it-department/faculty')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F2B705] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Faculty Directory</span>
          </button>
          <span className="text-xs font-mono text-slate-400">Profile Code: {member.id}</span>
        </div>
      </section>

      {/* Hero Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#003366] text-white shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-4 border-[#F2B705]/40">
          {member.avatarUrl && (
            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#F2B705] shadow-2xl">
                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="md:col-span-8 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              {member.isHOD && (
                <span className="px-3 py-1 rounded-full bg-[#F2B705] text-[#003366] text-xs font-extrabold font-mono uppercase inline-block mb-2">
                  HEAD OF DEPARTMENT
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{member.name}</h1>
              <span className="text-base font-bold text-[#F2B705] block">{member.title}</span>
              <span className="text-xs font-mono text-slate-200 block">{member.academicDegree}</span>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-slate-200 pt-2">
              {member.officeLocation && (
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <MapPin className="w-4 h-4 text-[#F2B705]" /> {member.officeLocation}
                </span>
              )}
              {member.email && (
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Mail className="w-4 h-4 text-[#00AEEF]" /> {member.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Bio & Academic Background */}
        <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-[#003366] flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#F2B705]" />
            <span>Biography & Academic Background</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed whitespace-pre-line">
            {member.biography || member.bio}
          </p>

          {/* Specializations */}
          {member.specialization && member.specialization.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-extrabold text-[#003366] block uppercase tracking-wider">Research & Subject Specializations</span>
              <div className="flex flex-wrap gap-2">
                {member.specialization.map((spec, idx) => (
                  <span key={idx} className="px-3 py-1 rounded bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Academic Qualifications */}
          {member.qualifications && member.qualifications.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <span className="text-xs font-extrabold text-[#003366] block uppercase tracking-wider">Academic Qualifications</span>
              <ul className="space-y-1 text-xs text-[#555555]">
                {member.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#F2B705]" />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Teaching & Assigned Courses */}
        <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
          <h2 className="text-xl font-extrabold text-[#003366] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#003366]" />
            <span>Assigned Teaching Courses</span>
          </h2>
          {memberCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memberCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded bg-[#003366] text-white font-mono text-xs font-bold">{course.courseCode}</span>
                    <span className="text-[11px] font-bold text-slate-600">{course.level}</span>
                  </div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">{course.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">Course assignments currently being synchronized for this lecturer.</p>
          )}
        </div>

        {/* Publications */}
        {memberPublications.length > 0 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-[#003366] flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Selected Publications</span>
            </h2>
            <div className="space-y-3">
              {memberPublications.map((pub) => (
                <div key={pub.id} className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>{pub.publicationType} • {pub.publicationYear}</span>
                    <span className="font-mono text-[#003366]">{pub.journalOrVenue}</span>
                  </div>
                  <h4 className="font-bold text-[#1A1A1A] text-sm">{pub.title}</h4>
                  <p className="text-xs text-slate-600">Authors: {pub.authors.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Projects */}
        {memberProjects.length > 0 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
            <h2 className="text-xl font-extrabold text-[#003366] flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-emerald-600" />
              <span>Led Research Projects</span>
            </h2>
            <div className="space-y-3">
              {memberProjects.map((rp) => (
                <div key={rp.id} className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-200 space-y-1">
                  <h4 className="font-bold text-[#1A1A1A] text-sm">{rp.title}</h4>
                  <p className="text-xs text-slate-600">{rp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
