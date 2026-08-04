import React from 'react';
import { INSTITUTION_INFO, FACULTY_DIRECTORY } from '../../data/groundTruth';
import { ConfirmBadge } from '../common/ConfirmBadge';

export const AboutSection: React.FC = () => {
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Prominent Navy Credo & Vision Callout Block */}
          <div className="lg:col-span-7 p-8 rounded-2xl bg-[#003366] text-white space-y-6 flex flex-col justify-between border-2 border-[#F2B705] shadow-md">
            <div className="space-y-4">
              <span className="text-xs font-mono font-black text-[#F2B705] uppercase tracking-widest block">
                FACULTY CREDO & VISION
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                "{INSTITUTION_INFO.facultyCredo}"
              </h3>
              <p className="body-text text-sm sm:text-base text-slate-200 leading-relaxed italic border-l-2 border-[#F2B705] pl-4 py-1">
                Vision: "{INSTITUTION_INFO.facultyVision}"
              </p>
            </div>
            <div className="pt-4 border-t border-blue-900/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <span>Established 2008</span>
              <span className="text-[#F2B705] font-bold">Scholarship with Professionalism</span>
            </div>
          </div>

          {/* Location & Secretariat Information Block */}
          <div className="lg:col-span-5 p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-[#00AEEF] uppercase tracking-wider block">
                CAMPUS SECRETARIAT LOCATION
              </span>
              <h3 className="subheading text-2xl font-extrabold text-[#1A1A1A]">
                Justice Aryeetey Building
              </h3>
              <p className="body-text text-sm sm:text-base text-[#555555] leading-relaxed">
                {INSTITUTION_INFO.facultyLocation}
              </p>

              <div className="space-y-2 text-xs font-mono text-[#1A1A1A] pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="font-bold text-[#003366]">Secretariat Rooms:</span>
                  <span>Rooms 310 / 311 / 410</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#003366]">Faculty Tel:</span>
                  <span>{INSTITUTION_INFO.facultyPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-[#003366]">University Switchboard:</span>
                  <span>{INSTITUTION_INFO.switchboard}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Leadership Directory: Uncarded Horizontal List/Table */}
        <div>
          <div className="mb-6 pb-3 border-b border-slate-300">
            <h3 className="subheading text-2xl font-extrabold">Academic & Department Leadership</h3>
            <p className="body-text text-sm text-[#555555]">Verified faculty leads guiding the IT curriculum and student research.</p>
          </div>

          <div className="space-y-4">
            {FACULTY_DIRECTORY.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 max-w-2xl">
                  {member.avatarUrl && (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover object-top border-2 border-[#003366] shrink-0 shadow-sm"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="subheading text-lg font-bold text-[#1A1A1A]">{member.name}</h4>
                      {member.isUnconfirmedHOD && (
                        <ConfirmBadge tooltip="Current HOD name requires official institutional verification" />
                      )}
                    </div>
                    <p className="text-xs font-extrabold text-[#003366]">{member.title} • <span className="font-mono text-[#555555] font-semibold">{member.academicDegree}</span></p>
                    <p className="body-text text-sm text-[#555555] pt-1 leading-relaxed">{member.bio}</p>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-xs font-extrabold text-[#003366] block">Office Location</span>
                  <span className="text-xs font-semibold text-[#555555] block mt-0.5">{member.officeLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
