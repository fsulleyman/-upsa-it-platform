import React from 'react';
import type { StudentProject, NavSectionId } from '../../types';
import { SampleBadge } from '../common/SampleBadge';
import { ExternalLink, ArrowRight, Lightbulb } from 'lucide-react';

interface InnovationPreviewProps {
  projects: StudentProject[];
  onSelectProject: (project: StudentProject) => void;
  onNavigate: (section: NavSectionId) => void;
}

export const InnovationPreview: React.FC<InnovationPreviewProps> = ({
  projects,
  onSelectProject,
  onNavigate
}) => {
  // Take top featured or verified projects for preview (max 3)
  const previewProjects = projects
    .filter((p) => p.featured || p.isVerifiedReal)
    .slice(0, 3);

  const displayProjects = previewProjects.length > 0 ? previewProjects : projects.slice(0, 3);

  return (
    <section id="innovation-preview" className="py-16 bg-[#FFFFFF] border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#003366]" />
              <span className="text-xs font-mono font-bold text-[#003366] uppercase tracking-wider block">
                STUDENT CODE & SYSTEM ARCHITECTURE
              </span>
            </div>
            <h2 className="section-heading">
              Verified Student Systems & Prototypes
            </h2>
            <p className="body-text text-base text-[#555555]">
              Real software systems engineered by UPSA IT Studies students under faculty mentorship, presented at international conferences and deployed for real-world operations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('innovation')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>Explore All Innovations</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Projects Preview Grid (Max 3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group rounded-2xl bg-[#F5F7FA] border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Project Image Banner */}
                {project.imageUrl && (
                  <div className="w-full h-44 bg-slate-200 overflow-hidden relative border-b border-slate-200">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {project.isVerifiedReal ? (
                        <span className="px-2.5 py-1 rounded bg-[#003366] text-[#F2B705] border border-[#F2B705] font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                          VERIFIED REAL
                        </span>
                      ) : (
                        <SampleBadge label="Sample Showcase" />
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#003366] uppercase">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#555555]">
                      {project.date}
                    </span>
                  </div>

                  <h3 className="subheading text-base font-extrabold text-[#1A1A1A] group-hover:text-[#003366] transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  <p className="body-text text-xs text-[#555555] line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(project.technologies || []).slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-[#1A1A1A] text-[10px] font-mono font-bold border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-200/60 mt-3 flex items-center justify-between">
                <div className="text-xs font-semibold text-[#1A1A1A]">
                  <span className="text-[10px] text-[#555555] block">Student Lead:</span>
                  <span className="font-bold text-xs">{project.studentName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-extrabold text-[#003366] group-hover:text-blue-900">
                  <span>Inspect System</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner Callout */}
        <div className="mt-8 p-6 rounded-2xl bg-[#003366]/5 border border-[#003366]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-[#003366]">Discover full student system architectures & category filters</h4>
            <p className="text-xs text-[#555555] mt-0.5">Explore web development, AI platforms, cybersecurity tools, and analytics systems built by UPSA students.</p>
          </div>
          <button
            onClick={() => onNavigate('innovation')}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#003366] hover:text-blue-900 uppercase tracking-wider whitespace-nowrap cursor-pointer"
          >
            <span>View All Student Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
