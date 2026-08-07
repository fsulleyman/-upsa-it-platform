import React from 'react';
import type { StudentProject } from '../../types';
import { SampleBadge } from '../common/SampleBadge';
import { ExternalLink } from 'lucide-react';

interface InnovationShowcaseProps {
  projects: StudentProject[];
  onSelectProject: (project: StudentProject) => void;
  activeCategoryFilter: string | null;
  onFilterCategory: (category: string) => void;
}

export const InnovationShowcase: React.FC<InnovationShowcaseProps> = ({
  projects,
  onSelectProject,
  activeCategoryFilter,
  onFilterCategory
}) => {
  const categories = [
    'All',
    'Web Development',
    'Mobile Applications',
    'Artificial Intelligence',
    'Data Analytics',
    'Cybersecurity',
    'Information Systems'
  ];

  const activeCategory = activeCategoryFilter || 'All';

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <section id="innovation" className="py-16 bg-[#FFFFFF] border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-8 space-y-3">
          <span className="text-xs font-mono font-bold text-[#003366] uppercase tracking-wider block">
            STUDENT CODE & SYSTEM ARCHITECTURE
          </span>
          <h2 className="section-heading">
            Verified Student Systems & Prototypes
          </h2>
          <p className="body-text text-lg text-[#555555]">
            Real software systems engineered by UPSA IT Studies students under faculty mentorship, presented at international conferences and deployed for real-world operations.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold tracking-wider transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#003366] text-white shadow-sm'
                    : 'bg-[#F5F7FA] text-[#1A1A1A] hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group rounded-2xl bg-[#F5F7FA] border border-slate-300 hover:border-[#003366] hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Project Image Banner */}
                {project.imageUrl && (
                  <div className="w-full h-48 bg-slate-200 overflow-hidden relative border-b border-slate-200">
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

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#003366] uppercase">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold text-[#555555]">
                      {project.date}
                    </span>
                  </div>

                  <h3 className="subheading text-lg font-extrabold text-[#1A1A1A] group-hover:text-[#003366] transition-colors">
                    {project.title}
                  </h3>

                  <p className="body-text text-xs text-[#555555] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(project.technologies || []).slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-[#1A1A1A] text-[11px] font-mono font-bold border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-slate-200/60 mt-4 flex items-center justify-between">
                <div className="text-xs font-semibold text-[#1A1A1A]">
                  <span className="text-[11px] text-[#555555] block">Student Lead:</span>
                  <span className="font-bold">{project.studentName}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-extrabold text-[#003366] group-hover:text-blue-900">
                  <span>Inspect System</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
