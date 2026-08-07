import React from 'react';
import type { FacultyMember } from '../../types';
import { INSTITUTION_INFO } from '../../data/groundTruth';

interface AboutSectionProps {
  faculty?: FacultyMember[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ faculty }) => {
  const displayFaculty = faculty && faculty.length > 0 ? faculty : [];

  return (
    <section id="about" className="py-16 bg-[#F5F7FA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left-Aligned Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <h2 className="section-heading">
            Faculty Context & Leadership
          </h2>
          <p className="body-text text-lg text-[#555555]">
            The Department of Information Technology Studies is one of two academic departments under the {INSTITUTION_INFO.facultyName} (FITCS) at the University of Professional Studies, Accra.
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Main Editorial Block */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4">
              <h3 className="subheading text-xl font-extrabold text-[#1A1A1A]">
                Faculty Mission & Academic Credo
              </h3>
              <blockquote className="p-4 rounded-xl bg-blue-50 border-l-4 border-[#003366] text-[#003366] font-bold italic text-sm sm:text-base">
                "{INSTITUTION_INFO.facultyCredo}"
              </blockquote>
              <p className="body-text text-sm sm:text-base text-[#555555] leading-relaxed">
                {INSTITUTION_INFO.facultyVision}
              </p>
            </div>
          </div>

          {/* Location & Secretariat Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-3">
              <span className="text-xs font-mono font-bold text-[#003366] uppercase tracking-wider block">
                PHYSICAL LOCATION
              </span>
              <h4 className="font-extrabold text-[#1A1A1A] text-base">Justice Aryeetey Building</h4>
              <p className="body-text text-xs text-[#555555] leading-relaxed">
                {INSTITUTION_INFO.facultyLocation}
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-semibold text-[#555555]">
                <span>Est. {INSTITUTION_INFO.facultyEst}</span>
                <span>Madina, Accra</span>
              </div>
            </div>
          </div>

        </div>

        {/* Faculty Leadership Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300 pb-4">
            <h3 className="subheading text-2xl font-extrabold text-[#1A1A1A]">
              Academic & Department Leadership
            </h3>
            <span className="text-xs font-mono font-bold text-[#003366] uppercase">
              FACULTY EXCELLENCE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayFaculty.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4 hover:border-[#003366] transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Portrait Avatar */}
                  {member.avatarUrl && (
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-[#003366] mx-auto shadow-md">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="text-center space-y-1">
                    <h4 className="font-extrabold text-[#1A1A1A] text-base">{member.name}</h4>
                    <span className="text-xs font-bold text-[#003366] block">{member.title}</span>
                    <span className="text-[11px] font-mono text-[#555555] block">{member.academicDegree}</span>
                  </div>

                  <p className="body-text text-xs text-[#555555] text-center leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-center">
                  <span className="text-[11px] font-semibold text-[#555555] block">{member.officeLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
