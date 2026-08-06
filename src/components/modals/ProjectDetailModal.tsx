import React from 'react';
import type { StudentProject } from '../../types';
import { Modal } from '../common/Modal';
import { SampleBadge } from '../common/SampleBadge';
import { ExternalLink } from 'lucide-react';

interface ProjectDetailModalProps {
  project: StudentProject | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <Modal
      isOpen={!!project}
      onClose={onClose}
      title={project.title}
      subtitle={project.subtitle}
      maxWidth="xl"
    >
      <div className="space-y-6 text-xs text-[#1A1A1A]">
        
        {/* Project Image Banner */}
        {project.imageUrl && (
          <div className="w-full h-56 rounded-xl overflow-hidden bg-slate-100 border border-slate-300 shadow-md relative">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 text-xs font-bold text-[#003366] bg-white/90 px-3 py-1 rounded border border-slate-300 shadow-sm">
              System Architecture Preview
            </div>
          </div>
        )}

        {/* Verification & Classification Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F7FA] border border-slate-300">
          <div>
            <span className="text-[#555555] block text-xs uppercase font-mono font-bold">Project Classification</span>
            <span className="text-[#1A1A1A] font-extrabold text-sm">{project.category}</span>
          </div>
          <div>
            {project.isVerifiedReal ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-extrabold bg-[#003366] text-[#F2B705] border border-[#F2B705]">
                VERIFIED REAL PROJECT
              </span>
            ) : (
              <SampleBadge label="Sample Showcase" />
            )}
          </div>
        </div>

        {/* Detailed Overview */}
        <div>
          <h4 className="font-extrabold text-[#1A1A1A] text-sm sm:text-base mb-2">Technical Description & Architecture</h4>
          <p className="body-text text-sm text-[#555555] leading-relaxed">{project.fullDetails}</p>
        </div>

        {/* Technologies Stack Tags */}
        <div>
          <h4 className="font-extrabold text-[#003366] text-xs uppercase tracking-wider mb-2">Technologies & Architecture Stack</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-md bg-[#003366] text-white font-mono text-xs font-bold"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Developer Attribution */}
        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-slate-300 space-y-1">
          <span className="text-xs font-mono font-bold text-[#003366] uppercase">ENGINEERING CREDIT</span>
          <div className="text-sm font-extrabold text-[#1A1A1A]">{project.studentName}</div>
          <div className="text-xs text-[#555555] font-medium">Affiliation: {project.hubAffiliation} ({project.date})</div>
        </div>

        {/* External Media Link if available */}
        {project.articleUrl && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#003366] block">Official Media Feature</span>
              <span className="text-xs text-[#555555]">{project.articleSource || 'Read News Article'}</span>
            </div>
            <a
              href={project.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#003366] text-white font-extrabold text-xs flex items-center gap-1.5 hover:bg-blue-900 transition-colors"
            >
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-[#003366] hover:bg-blue-900 text-white font-extrabold text-xs shadow-md transition-colors"
          >
            Close Project
          </button>
        </div>

      </div>
    </Modal>
  );
};
