import React from 'react';

export const CommunitySection: React.FC = () => {
  return (
    <section id="community" className="py-16 bg-[#0B132B] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-mono font-bold text-[#F2B705] uppercase tracking-wider block">
            INDUSTRY INTEGRATION & TRADITIONS
          </span>
          <h2 className="section-heading text-white">
            Community & Professional Growth
          </h2>
          <p className="body-text text-lg text-slate-300">
            Connecting IT Studies students with industry learning platforms, executive master classes, and professional networks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: DataCamp Classroom Partnership */}
          <div className="p-8 rounded-2xl bg-[#001B40] border border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-[#F2B705]/50 transition-all">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/80 inline-block">
                INDUSTRY PARTNERSHIP
              </span>
              <h3 className="subheading text-2xl font-extrabold text-white">DataCamp Classroom Partnership</h3>
              <p className="body-text text-sm sm:text-base text-slate-300 leading-relaxed">
                The Department leverages the <strong className="text-[#F2B705]">DataCamp Classroom</strong> initiative, granting IT Studies students direct access to hands-on data science, Python analytics, SQL data warehousing, and R programming coursework.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Data-Skills Coursework Integration</span>
              <span>Active Partnership</span>
            </div>
          </div>

          {/* Card 2: Annual Master Class Programme */}
          <div className="p-8 rounded-2xl bg-[#001B40] border border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-[#F2B705]/50 transition-all">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#F2B705] bg-[#003366] px-3 py-1 rounded-md border border-[#F2B705]/30 inline-block">
                FACULTY TRADITION
              </span>
              <h3 className="subheading text-2xl font-extrabold text-white">UPSA Annual Master Class Programme</h3>
              <p className="body-text text-sm sm:text-base text-slate-300 leading-relaxed">
                A landmark FITCS faculty tradition bringing top industry executives, chief technology officers (CTOs), and cybersecurity auditors directly into the classroom for intensive executive lectures and mentorship.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-[#00AEEF]">
              <span>Executive Industry Mentorship</span>
              <span className="text-[#F2B705]">Annual Faculty Event</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
