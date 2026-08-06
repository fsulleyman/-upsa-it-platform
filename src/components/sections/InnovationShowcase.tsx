import React from 'react';
import { PROJECTS } from '../../data/groundTruth';
import type { StudentProject } from '../../types';
import { SampleBadge } from '../common/SampleBadge';
import { ExternalLink } from 'lucide-react';

interface InnovationShowcaseProps {
  onSelectProject: (project: StudentProject) => void;
  activeCategoryFilter: string | null;
  onFilterCategory: (category: string) => void;
}

export const InnovationShowcase: React.FC<InnovationShowcaseProps> = ({
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

  const currentCategory = activeCategoryFilter || 'All';

  const filteredProjects = PROJECTS.filter((proj) => {
    if (currentCategory === 'All') return true;
    return proj.category === currentCategory;
  });

  return (
    <section id="innovation" className="py-16 bg-[#FFFFFF] border-b border-slate-200 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (High Contrast #1A1A1A Heading on White Background) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10 items-end">
          <div className="lg:col-span-8 space-y-3">
            <h2 className="section-heading text-[#1A1A1A] font-extrabold">
              Verified Student Systems & Prototypes
            </h2>
            <p className="body-text text-lg text-[#555555]">
              Real software systems engineered by UPSA IT Studies students under faculty mentorship.
            </p>
          </div>

          <div className="lg:col-span-4 flex lg:justify-end">
            {/* Filter Pills with High Contrast Text */}
            <div className="inline-flex p-1.5 bg-[#F5F7FA] rounded-lg border border-slate-300 gap-1 flex-wrap">
              {categories.slice(0, 4).map((cat) => {
                const isActive = currentCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onFilterCategory(cat)}
                    className={`px-3.5 py-2 rounded-md text-xs font-extrabold tracking-wider transition-all ${
                      isActive
                        ? 'bg-[#003366] text-white shadow-sm'
                        : 'text-[#1A1A1A] hover:text-[#003366] bg-white border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Projects Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group rounded-xl bg-[#F5F7FA] border border-slate-300 shadow-sm hover:shadow-lg hover:border-[#003366] transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {project.imageUrl && (
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b border-slate-200">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {project.isVerifiedReal ? (
                      <span className="px-2.5 py-1 rounded bg-[#003366] text-[#F2B705] text-[10px] font-extrabold uppercase shadow-sm">
                        VERIFIED REAL PROJECT
                      </span>
                    ) : (
                      <SampleBadge label="Sample Showcase" />
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#555555]">
                    <span className="font-extrabold text-[#003366]">{project.category}</span>
                    <span className="font-mono font-bold text-[#555555]">{project.date}</span>
                  </div>

                  <h3 className="subheading text-lg font-extrabold text-[#1A1A1A] group-hover:text-[#003366] transition-colors">
                    {project.title}
                  </h3>

                  <p className="body-text text-sm text-[#555555] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[#1A1A1A]">{project.studentName}</span>
                    <span className="text-[#00AEEF] font-extrabold">{project.hubAffiliation}</span>
                  </div>

                  {project.articleUrl && (
                    <div className="pt-1">
                      <span className="text-[11px] font-extrabold text-[#003366] flex items-center gap-1">
                        <span>{project.articleSource || 'Read Media Article'}</span>
                        <ExternalLink className="w-3 h-3 text-[#F2B705]" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
