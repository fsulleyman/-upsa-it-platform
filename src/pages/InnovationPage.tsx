import React from 'react';
import type { StudentProject, NavSectionId } from '../types';
import { InnovationShowcase } from '../components/sections/InnovationShowcase';
import { FolderGit2 } from 'lucide-react';

interface InnovationPageProps {
  projects: StudentProject[];
  activeCategoryFilter?: string | null;
  onSelectProject: (proj: StudentProject) => void;
  onFilterCategory: (category: string) => void;
  onNavigate?: (section: NavSectionId) => void;
}

export const InnovationPage: React.FC<InnovationPageProps> = ({
  projects,
  activeCategoryFilter,
  onSelectProject,
  onFilterCategory
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#003366] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-[#F2B705]">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F2B705] uppercase tracking-wider">
            <FolderGit2 className="w-4 h-4" />
            <span>Practical Engineering Systems</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Student Innovation Showcase</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            Inspect real production software applications, blood bank systems, hospital platforms, and data pipelines engineered by UPSA IT Studies students.
          </p>
        </div>
      </section>

      {/* Main Innovation Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InnovationShowcase
          projects={projects}
          onSelectProject={onSelectProject}
          activeCategoryFilter={activeCategoryFilter || null}
          onFilterCategory={onFilterCategory}
        />
      </div>
    </div>
  );
};
